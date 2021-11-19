import { Pool } from 'pg';

let poolInstance;

export const initPostgresConnection = async (connectionString) => {
  if (!poolInstance) {
    try {
      poolInstance = new Pool({ connectionString });

      poolInstance.on('error', (err) => {
        console.error('Unexpected error on idle client', err);
        process.exit(-1);
      });

      const res = await poolInstance.query('SELECT NOW();');
      if (!res.rows?.[0].now) {
        throw new Error();
      }

      console.info('PG connection initialized');
    } catch (error) {
      console.error('DB ERROR', error);
      throw new Error('Error connecting to database');
    }
  }
};

export const getPgClient = () => poolInstance;
