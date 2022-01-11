import { getPgClient } from '../../database/postgres';
import { Planet } from '../../graphql/Systems/typeDef';

export const getPlanetsBySystemId = async (id: number): Promise<Planet> => {
  try {
    const pg = getPgClient();
    const result = await pg.query('SELECT * FROM planets WHERE system_id = $1;', [id]);

    return result.rows as Planet;
  } catch (error) {
    console.error('getPlanetsBySystemId', error);
    throw new Error(`Error loading planets for system id #${id}`);
  }
};
