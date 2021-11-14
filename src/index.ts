import { ApolloServer, gql } from 'apollo-server-express';
import { ApolloServerPluginDrainHttpServer } from 'apollo-server-core';
import { AuthenticationError } from 'apollo-server-errors';
import express, { Application, Request, Response } from "express";
import expressJwt from "express-jwt";
// import cors from 'cors';
// import postgraphile from "postgraphile";
import { migrateUp } from "./migrate/migrate";
import { getDbConnectionString } from "./utils/getDbConnectionString";
import { sign } from 'jsonwebtoken';
import http from 'http';
import { UserModel } from './domains/users/UserModel';
import { UsersTypeDefs } from './domains/users/typeDef';

// Add https://github.com/graphile/worker OR https://github.com/timgit/pg-boss

const JWT_SECRET = process.env.JWT_SECRET || "f1BtnWgD3VKY";
const JWT_ALGORITHM = 'HS256';

const typeDefs = gql`
  type Query {
    getFoo: String
  }

  type Mutation
`;

const resolvers = {
  Query: {
    getFoo(_parent: any, _args: any, { user }: any) {
      console.log(user)
      return user?.sub || 'Bar';
    }
  },
  Mutation: {
    async login(_parent: any, { email, password }: any) {

      const userId = await UserModel.getAuthenticatedUserId(email, password);
      console.log('mutation', email, password, userId);

      if(!userId) {
        throw new AuthenticationError('Authentication failed');
      }

      return sign(
        {},
        JWT_SECRET,
        { algorithm: JWT_ALGORITHM, subject: userId, expiresIn: "1d" }
      );
    }
  }
};

const bootstrap = async () => {
  const connectionString = process.env.DEV_CONNECTION || await getDbConnectionString(process.env.SECRET_ARN);
  // console.log('connectionString', connectionString);

  if(!connectionString) {
    throw Error('Fetch AWS Secret failed');
  }
  
  await migrateUp(connectionString);

  const app: Application = express();

  app.use(
    expressJwt({
      secret: JWT_SECRET,
      algorithms: [JWT_ALGORITHM],
      credentialsRequired: false
    })
  );
  
  const httpServer = http.createServer(app);
  const server = new ApolloServer({
    typeDefs: [typeDefs, UsersTypeDefs],
    resolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
    context: ({ req }) => {
      const user = req.user || null;
      return { user };
    }
  });
  
  await server.start();
    
  server.applyMiddleware({ app, cors: true });
  await new Promise<void>(resolve => httpServer.listen({ port: 4000 }, resolve));
  
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`);
  
  
  


  // app.use(cors());
  
  app.get("/foo", async (req: Request, res: Response) => {
    res.send(`TS App is Running - ${(process.env.SECRET_ARN || 'foobar').slice(0, 10)}`)
  }); 

  // app.get("/health", async (_req: Request, res: Response) => {
  //   res.status(200).json({
  //     uptime: process.uptime(),
  //     message: 'Ok',
  //     date: new Date()
  //   });
  // }); 

  // app.use(
  //     postgraphile(
  //         connectionString,
  //         "public",
  //         {
  //             watchPg: true,
  //             graphiql: true,
  //             enhanceGraphiql: true,
  //             // jwtSecret: 'supersecretjwttokenpass',
  //             // jwtPgTypeIdentifier: 'public.jwt_token',
  //             // pgDefaultRole: 'guest'
  //         } 
  //     )
  // );
  
  // const expressPort = process.env.PORT || 8080;
  // const server = app.listen(expressPort, () => {
  //     console.log(`Blitz Backend is running on PORT ${expressPort}`)
  // }); 

  process.on('SIGTERM', () => {
    console.log('SIGTERM signal received: closing Express server')

    //ToDo: Shutdown pg pool connection
    // server.close(() => {
    //   console.log('Express server successfully closed')
    // })
  })
}

bootstrap().catch((err: any) => {
  console.error(err);
  process.exit(1);
});