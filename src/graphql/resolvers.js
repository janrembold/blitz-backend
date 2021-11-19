import { resolvers as userResolvers } from './users/resolvers';
import { resolvers as shipResolvers } from './ships/resolvers';

export const resolvers = [userResolvers, shipResolvers];
