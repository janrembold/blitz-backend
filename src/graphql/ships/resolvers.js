import { ForbiddenError } from 'apollo-server-errors';
import { PubSub } from 'graphql-subscriptions';
import { Ships } from '../../models/Ships';

const pubsub = new PubSub();
const NEW_SHIP_POSITION_PUBSUB = 'UPDATE_SHIP_SUBSCRIPTION';

export const resolvers = {
  Query: {
    async getShipsInSystem(_parent, { systemId }, { user }) {
      const allShips = await Ships().getAllShipsInSystem(systemId);
      console.log('query getShipsInSystem for', systemId, allShips, user.sub);

      // TODO: automate that!!!!
      // if (!user.sub) {
      //   throw new AuthenticationError('Not authenticated');
      // }

      return allShips;
    },
  },
  Mutation: {
    async updateShipPosition(_parent, { systemId, shipId, x, y }, { user }) {
      console.log('mutation updateShipPosition', systemId, shipId, x, y, user.sub);

      // const ship = await UserModel.getAuthenticatedUserId(email, password);

      if (!true) {
        throw new ForbiddenError('Cheater!!!!');
      }

      if (user.sub !== ship.user_id) {
        pubsub.publish(NEW_SHIP_POSITION_PUBSUB, { shipId, x, y });
      }
      return true;
    },
  },
  Subscription: {
    newShipPosition: {
      subscribe: () => pubsub.asyncIterator([NEW_SHIP_POSITION_PUBSUB]),
    },
  },
};
