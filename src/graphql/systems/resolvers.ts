import { AuthenticationError } from 'apollo-server-errors';
import { getMinesBySystemId } from '../../models/Mines/getMinesBySystemId';
import { getMobShipsBySystem } from '../../models/MobShips/getMobShipsBySystem';
import { getPlanetsBySystemId } from '../../models/Planets/getPlanetsBySystemId';
import { getStationsBySystemId } from '../../models/Stations/getStationsBySystemId';
import { getSystem } from '../../models/Systems/getSystem';
import { getSystems } from '../../models/Systems/getSystems';
import { System } from './typeDef';

// ToDo: update typings: https://stackoverflow.com/questions/67830070/graphql-apollo-server-resolvers-arguments-types

export const SystemsResolvers = {
  Query: {
    async systems(_parent: undefined, _args: any, { user }: any) {
      if (!user) {
        throw new AuthenticationError('Authentication Error');
      }

      return await getSystems();
    },
    async system(_parent: undefined, { id }: any, { user }: any) {
      if (!user) {
        throw new AuthenticationError('Authentication Error');
      }

      return await getSystem(id);
    },
  },
  SystemWithItems: {
    async planets({ id }: System) {
      return await getPlanetsBySystemId(id);
    },
    async stations({ id }: System) {
      return await getStationsBySystemId(id);
    },
    async mines({ id }: System) {
      return await getMinesBySystemId(id);
    },
    async mobShips(system: System) {
      return await getMobShipsBySystem(system);
    },
  },
};
