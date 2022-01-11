import { addSeconds } from 'date-fns';
import format from 'pg-format';
import { getPgClient } from '../../database/postgres';
import { publishToQueue } from '../../queue/boss';
import { getRoutingPointsTotalDistance } from '../../utils/distance';

export const getAllMobShipPositionsBySystemId = async (systemId: number) => {
  const pg = getPgClient();

  try {
    const res = await pg.query(
      `
      SELECT 
        msp.id, 
        msp.speed, 
        msp.system_id, 
        msp.routing_points, 
        msp.blocked, 
        msp.created_at,
        json_build_object(
          'id', ms.id,
          'asset_key', ms.asset_key,
          'type', ms.type
        ) as mob_ship
      FROM mob_ship_positions msp 
      LEFT JOIN mob_ships ms ON ms.id = msp.mob_ship_id
      WHERE msp.system_id = $1;
    `,
      [systemId],
    );

    return res.rows;
  } catch (error) {
    console.error('getAllMobShipPositionsBySystemId', error);
    throw new Error('Error query mob ship positions by system id');
  }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const insertMobShips = async (ships: any): Promise<number> => {
  const pg = getPgClient();

  if (!ships.length) {
    return 0;
  }

  try {
    const res = await pg.query(
      format(
        'INSERT INTO mob_ship_positions (mob_ship_id, system_id, speed, routing_points) VALUES %L RETURNING *;',
        ships,
      ),
    );

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    res.rows.forEach((row: any) => {
      const { id, routing_points, created_at } = row;

      // ToDo: load speed (pixel/sec) from either cached mob_ships data or from static object
      const speed = 10;
      const timeToRemoveInSeconds = getRoutingPointsTotalDistance(routing_points.route) / speed;
      const startAfter = addSeconds(new Date(created_at), timeToRemoveInSeconds);

      publishToQueue(`mob-ship-remove-${id}`, { mobShipPosition: row }, { startAfter });
      console.log('create mob ship', id);
    });

    return res.rowCount;
  } catch (error) {
    console.error('insertMobShips', error);
  }

  return 0;
};
