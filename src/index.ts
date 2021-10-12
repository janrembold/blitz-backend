import express, { Application, Request, Response } from "express";
import cors from 'cors';
import postgraphile from "postgraphile";
import { getAwsSecret } from "./utils/getAwsSecret";


// const bootstrap = async () => {
//   const secret = await getAwsSecret(process.env.SECRET_ARN);
//   //ToDo: Run postgres migration
// }

getAwsSecret(process.env.SECRET_ARN).then(secret => {
  console.log('Secret', secret);

  const app: Application = express();
  
  app.use(cors())
  
  app.get("/", async (req: Request, res: Response) => {
    res.send(`TS App is Running - ${(process.env.SECRET_ARN || 'foobar').slice(0, 5)}`)
  }); 

  const url = `postgres://postgres:${secret}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;
  console.log('url', url);
  
  // app.use(
  //     postgraphile(
  //         url,
  //         "public",
  //         {
  //             watchPg: true,
  //             graphiql: true,
  //             enhanceGraphiql: true,
  //             jwtSecret: 'supersecretjwttokenpass',
  //             jwtPgTypeIdentifier: 'public.jwt_token',
  //             // pgDefaultRole: 'user_guest'
  //         } 
  //     )
  // );
  
  const port = process.env.PORT || 8080;
  app.listen(port, () => {
      console.log(`server is running on PORT ${port}`)
  }); 
}).catch(error => {
  console.log('Error while loading secret');
  console.log(error);
})

