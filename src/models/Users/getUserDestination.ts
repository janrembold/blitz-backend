import { getPgClient } from '../../database/postgres';
import { DestinationResponse } from '../../graphql/users/typeDef';

export const getUserDestination = async (userId: string): Promise<DestinationResponse[]> => {
  const pg = getPgClient();

  try {
    const res = await pg.query(
      `
      SELECT u.destination_id, d.system_id FROM users u
      LEFT JOIN destinations d ON d.id = u.destination_id
      WHERE u.id = $1 LIMIT 1;
    `,
      [userId],
    );

    return res.rows[0] as DestinationResponse[];
  } catch (error) {
    console.error('getUserDestination', error);
  }

  throw new Error('Error loading user destination');
};
