import { AuthenticationError } from 'apollo-server-errors';
import { sign } from 'jsonwebtoken';
import { JWT_ALGORITHM, JWT_SECRET } from '../../config/environment';
import { getUserDestination } from '../../models/Users/getUserDestination';
import { loginMutation } from './mutations/login';

// const pubsub = new PubSub();

export const UsersResolvers = {
  Query: {
    myDestination(_parent, _args, { user }) {
      if (!user) {
        throw new AuthenticationError();
      }

      return getUserDestination(user.sub);
    },
  },
  // Subscription: {
  //   subFoo: {
  //     subscribe: () => pubsub.asyncIterator(['SUB_FOO']),
  //   },
  // },
  Mutation: {
    async login(_parent, { email, password }) {
      const userId = await loginMutation(email, password);
      console.log('mutation', email, password, userId);

      if (!userId) {
        throw new AuthenticationError('Authentication failed');
      }

      return sign({}, JWT_SECRET, { algorithm: JWT_ALGORITHM, subject: userId, expiresIn: '14d' });
    },
  },
};
