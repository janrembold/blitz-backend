import { getPgClient } from '../../database/postgres';

export const removeMobShipPosition = async (id: number): Promise<number> => {
  const pg = getPgClient();

  try {
    const res = await pg.query('DELETE FROM mob_ship_positions WHERE id = $1;', [id]);

    return res.rowCount;
  } catch (error) {
    console.error('removeMobShipPosition', error);
    throw new Error('Error removing mob ship position');
  }
};
