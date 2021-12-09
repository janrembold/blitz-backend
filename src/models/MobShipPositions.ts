import format from 'pg-format';
import { getPgClient } from '../database/postgres';

export const getAllMobShipPositionsBySystemId = async (systemId: number) => {
  const pg = getPgClient();

  console.log('todo: getAllMobShipsInSystem', systemId);

  try {
    const res = await pg.query(`
      SELECT ms.name, msp.id, msp.routing_points 
      FROM mob_ship_positions msp 
      LEFT JOIN mob_ships ms ON ms.id = msp.mob_ship_id;
    `);

    return res.rows;
  } catch (error) {
    console.error('getAllMobShipPositionsBySystemId', error);
  }

  return [];
};

export const insertMobShips = async (ships: any): Promise<number> => {
  const pg = getPgClient();

  if (!ships.length) {
    return 0;
  }

  try {
    const res = await pg.query(
      format('INSERT INTO mob_ship_positions (mob_ship_id, routing_points) VALUES %L;', ships),
    );

    return res.rowCount;
  } catch (error) {
    console.error('insertMobShips', error);
  }

  return 0;
};
