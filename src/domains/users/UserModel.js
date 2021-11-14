import { getPostgresPool } from '../../database/postgres';

export const UserModel = {
  getAuthenticatedUserId: async (email, password) => {
    const pg = getPostgresPool();

    try {
      const res = await pg.query('SELECT get_authenticated_user_id($1, $2);', [email, password]);
      return res.rows?.[0]?.get_authenticated_user_id;
    } catch (error) {
      console.error('UserModel.getAuthenticatedUserId', error);
    }

    return null;
  },
};
