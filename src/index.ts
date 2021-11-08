import { ApolloServer, gql } from 'apollo-server-express';
import { ApolloServerPluginDrainHttpServer } from 'apollo-server-core';
import express, { Application, Request, Response } from "express";
import cors from 'cors';
// import postgraphile from "postgraphile";
import { migrateUp } from "./migrate/migrate";
import { getDbConnectionString } from "./utils/getDbConnectionString";
import { sign } from 'jsonwebtoken';
import http from 'http';

// Add https://github.com/graphile/worker OR https://github.com/timgit/pg-boss

const typeDefs = gql`
  # Comments in GraphQL strings (such as this one) start with the hash (#) symbol.

  # This "Book" type defines the queryable fields for every book in our data source.
  type Book {
    title: String
    author: String
  }

  # The "Query" type is special: it lists all of the available queries that
  # clients can execute, along with the return type for each. In this
  # case, the "books" query returns an array of zero or more Books (defined above).
  type Query {
    books: [Book]
  }
`;

const books = [
  {
    title: 'The Awakening',
    author: 'Kate Chopin',
  },
  {
    title: 'City of Glass',
    author: 'Paul Auster',
  },
];

const resolvers = {
  Query: {
    books: () => books,
  },
};

const bootstrap = async () => {
  const connectionString = process.env.DEV_CONNECTION || await getDbConnectionString(process.env.SECRET_ARN);
  console.log('connectionString', connectionString);

  if(!connectionString) {
    throw Error('Fetch AWS Secret failed');
  }
  
  await migrateUp(connectionString);

  const app: Application = express();
  
  const httpServer = http.createServer(app);
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
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

    // server.close(() => {
    //   console.log('Express server successfully closed')
    // })
  })
}

bootstrap().catch((err: any) => {
  console.error(err);
  process.exit(1);
});