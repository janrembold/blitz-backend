import { AuthenticationError } from 'apollo-server-errors';
import { getSystemDestinations } from '../../models/Destinations/getSystemDestinations';

export const DestinationsResolvers = {
  Query: {
    async getSystemDestinations(_parent, { systemId }, { user }) {
      if (!user) {
        throw new AuthenticationError();
      }

      return await getSystemDestinations(systemId);
    },
  },
};
