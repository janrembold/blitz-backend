import { knex } from 'knex';

let knexInstance;

export const initKnexConnection = async (connectionString) => {
  if (!knexInstance) {
    knexInstance = knex({
      client: 'pg',
      connection: connectionString,
    });

    // await knexInstance
    //   .queryBuilder()
    //   .raw('NOW()')
    //   .then(() => {
    //     console.log('PG knex connected');
    //   })
    //   .catch((error) => {
    //     console.error('Knex ERROR', error);
    //     throw new Error('Error connecting to database');
    //   });
  }
};

export const getKnexClient = () => knexInstance;
