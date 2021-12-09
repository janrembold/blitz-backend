import { getPgClient } from '../../database/postgres';

export const getMobShipCount = async (systemId: number): Promise<number> => {
  const pg = getPgClient();

  console.log('todo: getMobShipCount add systemId', systemId);

  try {
    const res = await pg.query('SELECT count(*) as cnt FROM mob_ship_positions;');

    return res.rows[0].cnt as number;
  } catch (error) {
    console.error('getMobShipCount', error);
  }

  return 0;
};
