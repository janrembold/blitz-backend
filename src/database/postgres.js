import { Pool } from 'pg';

let poolInstance;

export const getPostgresPool = () => {
  if (!poolInstance) {
    try {
      poolInstance = new Pool({ connectionString: process.env.DEV_CONNECTION });

      poolInstance.on('error', (err) => {
        console.error('Unexpected error on idle client', err);
        process.exit(-1);
      });
    } catch (error) {
      console.log('DB ERROR', error);
    }
  }

  return poolInstance;
};
