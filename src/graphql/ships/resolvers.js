import { AuthenticationError } from 'apollo-server-errors';
import { PubSub, withFilter } from 'graphql-subscriptions';

const pubsub = new PubSub();
const NEW_SHIP_POSITION_PUBSUB = 'UPDATE_SHIP_SUBSCRIPTION';

export const resolvers = {
  Query: {
    async getShipsInSystem(_parent, { systemId }, { user }) {
      if (!user) {
        throw new AuthenticationError();
      }

      console.log('query getShipsInSystem for', systemId, user);
      return []; // await Ships().getAllShipsInSystem(systemId);
    },
  },
  Mutation: {
    async updateShipPosition(_parent, { systemId, shipId, x, y }, { user }) {
      if (!user) {
        throw new AuthenticationError();
      }

      console.log('mutation updateShipPosition', systemId, shipId, x, y, user);

      // const ship = await UserModel.getAuthenticatedUserId(email, password);
      // if (!true) {
      //   throw new ForbiddenError('Cheater!!!!');
      // }

      pubsub.publish(NEW_SHIP_POSITION_PUBSUB, { newShipPosition: { systemId, shipId, x, y } });
      // if (user.sub !== ship.user_id) {
      // }
      return true;
    },
  },
  Subscription: {
    newShipPosition: {
      subscribe: withFilter(
        () => pubsub.asyncIterator([NEW_SHIP_POSITION_PUBSUB]),
        (payload, variables) => payload.newShipPosition.systemId === variables.systemId,
      ),
    },
  },
};
