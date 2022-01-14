import { getPgClient } from '../../database/postgres';
import { DestinationResponse } from '../../graphql/Users/typeDef';

export const getUserDestination = async (userId: string): Promise<DestinationResponse> => {
  const pg = getPgClient();

  try {
    const res = await pg.query(
      `
      SELECT p.system_id, p.x, p.y 
      FROM users u
      LEFT JOIN planets p ON p.id = u.planet_id
      WHERE u.id = $1 LIMIT 1;
    `,
      [userId],
    );

    return res.rows[0] as DestinationResponse;
  } catch (error) {
    console.error('getUserDestination', error);
    throw new Error('Error loading user destination');
  }
};
