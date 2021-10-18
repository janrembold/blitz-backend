import express, { Application, Request, Response } from "express";
import cors from 'cors';
import postgraphile from "postgraphile";
import { getAwsSecret } from "./utils/getAwsSecret";
import { Pool } from 'pg';
import { migrateUp } from "./umzug/umzug";


// Add https://github.com/sequelize/umzug
// Add https://github.com/graphile/worker OR https://github.com/timgit/pg-boss

const getDbConnectionString = async (): Promise<string> => {
  const {username, password, host, port, dbname} = await getAwsSecret(process.env.SECRET_ARN);
  // const connectionString = `postgresql://postgres:${credentials.password}@${process.env.DB_HOST}:5432/blitz`;
  return `postgres://${username}:${password}@${host}:${port}/${dbname}`;
}

const bootstrap = async () => {
  const connectionString = await getDbConnectionString();
  console.log('connectionString', connectionString);

  if(!connectionString) {
    throw Error('Fetch AWS Secret failed');
  }
  
  await migrateUp(connectionString);

  const pool = new Pool({ connectionString });
  console.log('Pool created');

  try {
    console.log('Fire SELECT NOW');
    const res = await pool.query('SELECT NOW()');
    console.log('SELECT NOW', res);
    // await pool.end();
  } catch(err: unknown) {
    console.error('SELECT NOW ERROR', err)
  }

  //ToDo: Run postgres migration

  const app: Application = express();
  
  app.use(cors())
  
  app.get("/", async (req: Request, res: Response) => {
    res.send(`TS App is Running - ${(process.env.SECRET_ARN || 'foobar').slice(0, 10)}`)
  }); 

  app.use(
      postgraphile(
          connectionString,
          "public",
          {
              watchPg: true,
              graphiql: true,
              enhanceGraphiql: true,
              // jwtSecret: 'supersecretjwttokenpass',
              // jwtPgTypeIdentifier: 'public.jwt_token',
              // pgDefaultRole: 'user_guest'
          } 
      )
  );
  
  const expressPort = process.env.PORT || 8080;
  const server = app.listen(expressPort, () => {
      console.log(`Blitz Backend is running on PORT ${expressPort}`)
  }); 

  process.on('SIGTERM', () => {
    console.log('SIGTERM signal received: closing Express server')

    server.close(() => {
      console.log('Express server successfully closed')
    })
  })
}

bootstrap().catch((err: any) => {
  console.error(err);
  process.exit(1);
});