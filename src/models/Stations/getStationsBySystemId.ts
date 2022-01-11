import { getPgClient } from '../../database/postgres';
import { Station } from '../../graphql/Systems/typeDef';

export const getStationsBySystemId = async (id: number): Promise<Station[]> => {
  try {
    const pg = getPgClient();
    const result = await pg.query('SELECT * FROM stations WHERE system_id = $1;', [id]);

    return result.rows as Station[];
  } catch (error) {
    console.error('getStationsBySystemId', error);
    throw new Error(`Error loading stations for system id #${id}`);
  }
};
