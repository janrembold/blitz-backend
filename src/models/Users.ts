import { getPgClient } from '../database/postgres';

export const getAuthenticatedUserId = async (email: string, password: string) => {
  const pg = getPgClient();

  try {
    const res = await pg.query('SELECT get_authenticated_user_id($1, $2);', [email, password]);

    console.log('getAuthenticatedUserId res', res);
    return res.rows?.[0]?.get_authenticated_user_id;
  } catch (error) {
    console.error('getAuthenticatedUserId', error);
  }

  return null;
};
