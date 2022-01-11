import { getPgClient } from '../../database/postgres';
import { Mine } from '../../graphql/Systems/typeDef';

export const getMinesBySystemId = async (id: number): Promise<Mine[]> => {
  try {
    const pg = getPgClient();
    const result = await pg.query(
      `
      SELECT 
        m.*,
        row_to_json(u.*) as user
      FROM mines m 
      LEFT JOIN users u ON u.id = m.user_id
      WHERE m.system_id = $1;  
    `,
      [id],
    );

    return result.rows as Mine[];
  } catch (error) {
    console.error('getMinesBySystemId', error);
    throw new Error(`Error loading mines for system id #${id}`);
  }
};
