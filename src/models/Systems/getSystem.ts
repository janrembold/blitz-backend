import { getPgClient } from '../../database/postgres';
import { System } from '../../graphql/Systems/typeDef';

export const getSystem = async (id: number): Promise<System> => {
  try {
    const pg = getPgClient();
    const result = await pg.query('SELECT * FROM systems WHERE id = $1;', [id]);

    return result.rows[0] as System;
  } catch (error) {
    console.error('getSystem', error);
    throw new Error(`Error loading system #${id}`);
  }
};
