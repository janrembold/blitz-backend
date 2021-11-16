import { AuthenticationError } from 'apollo-server-errors';
import { PubSub } from 'graphql-subscriptions';
import { sign } from 'jsonwebtoken';
import { JWT_ALGORITHM, JWT_SECRET } from '../../config/environment';
import { UserModel } from './UserModel';

const pubsub = new PubSub();

export const resolvers = {
  Query: {
    getFoo(_parent, _args, { user }) {
      console.log('getFoo USER', user);
      pubsub.publish('SUB_FOO', { subFoo: 'SUB FOO !!!!' });
      return user?.sub || 'no user id found in header';
    },
  },
  Subscription: {
    subFoo: {
      subscribe: () => pubsub.asyncIterator(['SUB_FOO']),
    },
  },
  Mutation: {
    async login(_parent, { email, password }) {
      const userId = await UserModel.getAuthenticatedUserId(email, password);
      console.log('mutation', email, password, userId);

      if (!userId) {
        throw new AuthenticationError('Authentication failed');
      }

      return sign({}, JWT_SECRET, { algorithm: JWT_ALGORITHM, subject: userId, expiresIn: '1d' });
    },
  },
};
