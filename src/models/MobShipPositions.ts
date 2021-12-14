import { addSeconds } from 'date-fns';
import format from 'pg-format';
import { getPgClient } from '../database/postgres';
import { publishToQueue } from '../queue/boss';
import { getRoutingPointsTotalDistance } from '../utils/distance';

export const getAllMobShipPositionsBySystemId = async (systemId: number) => {
  const pg = getPgClient();

  console.log('todo: getAllMobShipsInSystem', systemId);

  try {
    const res = await pg.query(`
      SELECT ms.name, ms.speed, msp.id, msp.routing_points, msp.created_at 
      FROM mob_ship_positions msp 
      LEFT JOIN mob_ships ms ON ms.id = msp.mob_ship_id;
    `);

    return res.rows;
  } catch (error) {
    console.error('getAllMobShipPositionsBySystemId', error);
  }

  return [];
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const insertMobShips = async (ships: any): Promise<number> => {
  const pg = getPgClient();

  if (!ships.length) {
    return 0;
  }

  try {
    const res = await pg.query(
      format('INSERT INTO mob_ship_positions (mob_ship_id, routing_points) VALUES %L RETURNING *;', ships),
    );

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    res.rows.forEach((row: any) => {
      const { id, routing_points, created_at } = row;

      // ToDo: load speed (pixel/sec) from either cached mob_ships data or from static object
      const speed = 20;
      const timeToRemoveInSeconds = getRoutingPointsTotalDistance(routing_points.route) / speed;
      const startAfter = addSeconds(new Date(created_at), timeToRemoveInSeconds);

      publishToQueue(`mob-ship-remove-${id}`, { mobShipPosition: row }, { startAfter });
      console.log('publish new mob ship to queue', `mob-ship-remove-${id}`, created_at, startAfter);
    });

    return res.rowCount;
  } catch (error) {
    console.error('insertMobShips', error);
  }

  return 0;
};
