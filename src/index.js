import { makeExecutableSchema } from '@graphql-tools/schema';
import { ApolloServerPluginDrainHttpServer } from 'apollo-server-core';
import { ApolloServer } from 'apollo-server-express';
import cors from 'cors';
import express from 'express';
import { execute, subscribe } from 'graphql';
import { createServer } from 'http';
import { SubscriptionServer } from 'subscriptions-transport-ws';
import { DEV_CONNECTION, PORT, SECRET_ARN } from './config/environment';
import { initPostgresConnection } from './database/postgres';
import { resolvers, typeDefs } from './graphql';
import { migrateUp } from './migrate/migrate';
import { initQueue, stopQueue } from './queue/boss';
import { initAllSubscriptions } from './queue/subscriptions/initAllSubscriptions';
import { getDbConnectionString } from './utils/getDbConnectionString';
import { decodeJwtToken } from './utils/jwt';

/**
 * ## ToDos ##
 *
 * - add refresh token - see: https://hasura.io/blog/best-practices-of-using-jwt-with-graphql/
 * - use Cache Manager to store refresh tokens - see: https://www.npmjs.com/package/cache-manager
 */

const bootstrap = async () => {
  const connectionString = DEV_CONNECTION || (await getDbConnectionString(SECRET_ARN));
  if (!connectionString) {
    throw Error('No DB connection found');
  }

  console.info('Hello Galaxy', new Date().toISOString());

  await migrateUp(connectionString);
  await initQueue(connectionString);
  await initPostgresConnection(connectionString);
  // await initKnexConnection(connectionString);
  initAllSubscriptions();

  const app = express();
  app.disable('x-powered-by');
  app.use(
    cors({
      origin: '*',
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      preflightContinue: false,
      optionsSuccessStatus: 204,
    }),
  );

  let subscriptionServer;
  const httpServer = createServer(app);

  const schema = makeExecutableSchema({
    typeDefs,
    resolvers,
  });

  const server = new ApolloServer({
    schema,
    plugins: [
      {
        async serverWillStart() {
          return {
            async drainServer() {
              await stopQueue();
              subscriptionServer && subscriptionServer.close();
            },
          };
        },
      },
      ApolloServerPluginDrainHttpServer({ httpServer }),
    ],
    context: ({ req }) => {
      return { user: decodeJwtToken(req.headers.authorization) };
    },
  });

  await server.start();
  server.applyMiddleware({ app, cors: false });

  subscriptionServer = SubscriptionServer.create(
    {
      schema,
      execute,
      subscribe,
      async onConnect(connectionParams) {
        if (connectionParams.authorization) {
          console.log('subscription onConnect params', connectionParams);
          // const currentUser = await findUser(connectionParams.authorization);
          // return { currentUser };
        }
        // throw new Error('Missing auth token!');

        return {};
      },
    },
    {
      server: httpServer,
      path: server.graphqlPath,
    },
  );

  await new Promise((resolve) => httpServer.listen({ port: PORT }, resolve));
  console.log(`???? Server ready at http://localhost:${PORT}${server.graphqlPath}`);

  app.get('/time', async (_req, res) => {
    const date = new Date();

    res.status(200).json({
      time: date.toISOString(),
    });
  });

  app.get('/health', async (_req, res) => {
    res.status(200).json({
      uptime: process.uptime(),
      message: 'Ok',
      date: new Date(),
    });
  });
};

bootstrap().catch((err) => {
  console.error(err);
  process.exit(-1);
});
