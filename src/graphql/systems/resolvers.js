import { AuthenticationError } from 'apollo-server-errors';
import { getAllSystems } from '../../models/Systems/getAllSystems';

export const SystemsResolvers = {
  Query: {
    async getAllSystems(_parent, _args, { user }) {
      if (!user) {
        throw new AuthenticationError();
      }

      return await getAllSystems();
    },
  },
};
