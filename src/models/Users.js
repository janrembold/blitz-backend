import { getKnexClient } from '../database/knex';

export function Users() {
  const knex = getKnexClient();

  return {
    getAuthenticatedUserId: (email, password) => {
      try {
        const res = knex.select(knex.raw('get_authenticated_user_id(?, ?) AS id', [email, password])); //await pg.query('SELECT get_authenticated_user_id($1, $2);', [email, password]);
        return res.rows?.[0]?.get_authenticated_user_id;
      } catch (error) {
        console.error('Users getAuthenticatedUserId', error);
      }

      return null;
    },
  };
}
