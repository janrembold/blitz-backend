import { AuthenticationError } from 'apollo-server-errors';
import { PubSub, withFilter } from 'graphql-subscriptions';
import { getAllMobShipsInSystem } from '../../game/MobShips/getAllMobShipsInSystem';

const pubsub = new PubSub();
const NEW_SHIP_POSITION_PUBSUB = 'UPDATE_SHIP_SUBSCRIPTION';

export const MobShipSResolvers = {
  Query: {
    async getAllMobShipsInSystem(_parent, { systemId }, { user }) {
      if (!user) {
        throw new AuthenticationError();
      }

      return getAllMobShipsInSystem(systemId);
    },
  },
  Subscription: {
    updateMobShip: {
      subscribe: withFilter(
        () => pubsub.asyncIterator([NEW_SHIP_POSITION_PUBSUB]),
        (payload, variables) => payload.newShipPosition.systemId === variables.systemId,
      ),
    },
  },
};
