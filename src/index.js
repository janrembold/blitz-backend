import { ApolloServer } from 'apollo-server-express';
import { ApolloServerPluginDrainHttpServer } from 'apollo-server-core';
import express from 'express';
import expressJwt from 'express-jwt';
import { createServer } from 'http';
import { execute, subscribe } from 'graphql';
import { SubscriptionServer } from 'subscriptions-transport-ws';
import { makeExecutableSchema } from '@graphql-tools/schema';

import { migrateUp } from './migrate/migrate';
import { getDbConnectionString } from './utils/getDbConnectionString';
import { typeDefs, resolvers } from './graphql';
import { DEV_CONNECTION, JWT_ALGORITHM, JWT_SECRET, SECRET_ARN } from './config/environment';
import { initPostgresConnection } from './database/postgres';
import { initQueue } from './queue/boss';

const bootstrap = async () => {
  const connectionString = DEV_CONNECTION || (await getDbConnectionString(SECRET_ARN));
  if (!connectionString) {
    throw Error('No DB connection found');
  }

  await migrateUp(connectionString);
  await initQueue(connectionString);
  initPostgresConnection(connectionString);

  const app = express();
  const httpServer = createServer(app);
  let subscriptionServer;

  app.disable('x-powered-by');
  app.use(
    expressJwt({
      secret: JWT_SECRET,
      algorithms: [JWT_ALGORITHM],
      credentialsRequired: false,
    }),
  );

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
              subscriptionServer && subscriptionServer.close();
            },
          };
        },
      },
      ApolloServerPluginDrainHttpServer({ httpServer }),
    ],
    context: ({ req }) => ({ user: req.user || null }),
  });

  await server.start();
  server.applyMiddleware({ app, cors: true });

  subscriptionServer = SubscriptionServer.create(
    { schema, execute, subscribe },
    {
      server: httpServer,
      path: server.graphqlPath,
    },
  );

  await new Promise((resolve) => httpServer.listen({ port: 4000 }, resolve));
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`);

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
