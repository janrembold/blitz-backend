import { getPgClient } from '../../database/postgres';
import { Planet } from '../../graphql/Systems/typeDef';

export const getPlanetsBySystemId = async (id: number): Promise<Planet[]> => {
  try {
    const pg = getPgClient();
    const result = await pg.query(
      `
      SELECT 
        p.*,
        json_agg(u.*) as users
      FROM planets p 
      LEFT JOIN users u ON u.planet_id = p.id
      WHERE p.id = $1
      GROUP BY p.id;
    `,
      [id],
    );

    return result.rows as Planet[];
  } catch (error) {
    console.error('getPlanetsBySystemId', error);
    throw new Error(`Error loading planets for system id #${id}`);
  }
};
