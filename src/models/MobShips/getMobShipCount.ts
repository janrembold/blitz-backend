import { getPgClient } from '../../database/postgres';

export const getMobShipCount = async (systemId: number): Promise<number> => {
  const pg = getPgClient();

  try {
    const res = await pg.query('SELECT count(*) as cnt FROM mob_ship_positions WHERE system_id = $1;', [
      systemId,
    ]);

    return res.rows[0].cnt as number;
  } catch (error) {
    console.error('getMobShipCount', error);
    throw new Error('Error selcting mob ship position count');
  }
};
