import { PubSub, withFilter } from 'graphql-subscriptions';

const pubsub = new PubSub();
const NEW_SHIP_POSITION_PUBSUB = 'UPDATE_SHIP_SUBSCRIPTION';

export const MobShipSResolvers = {
  // Query: {
  //   async getAllMobShipsInSystem(_parent, { systemId }, { user }) {
  //     if (!user) {
  //       throw new AuthenticationError();
  //     }

  //     return getMobShipsBySystem(systemId);
  //   },
  // },
  Subscription: {
    updateMobShip: {
      subscribe: withFilter(
        () => pubsub.asyncIterator([NEW_SHIP_POSITION_PUBSUB]),
        (payload, variables) => payload.newShipPosition.systemId === variables.systemId,
      ),
    },
  },
};
