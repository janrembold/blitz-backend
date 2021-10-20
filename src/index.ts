import express, { Application, Request, Response } from "express";
import cors from 'cors';
import postgraphile from "postgraphile";
import { migrateUp } from "./migrate/migrate";
import { getDbConnectionString } from "./utils/getDbConnectionString";

// Add https://github.com/graphile/worker OR https://github.com/timgit/pg-boss

const bootstrap = async () => {
  const connectionString = process.env.DEV_CONNECTION || await getDbConnectionString(process.env.SECRET_ARN);
  console.log('connectionString', connectionString);

  if(!connectionString) {
    throw Error('Fetch AWS Secret failed');
  }
  
  await migrateUp(connectionString);

  const app: Application = express();
  
  app.use(cors())
  
  app.get("/", async (req: Request, res: Response) => {
    res.send(`TS App is Running - ${(process.env.SECRET_ARN || 'foobar').slice(0, 10)}`)
  }); 

  app.get("/health", async (_req: Request, res: Response) => {
    res.status(200).json({
      uptime: process.uptime(),
      message: 'Ok',
      date: new Date()
    });
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