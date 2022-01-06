import { DestinationsResolvers } from './destinations/resolvers';
import { MobShipSResolvers } from './mobShips/resolvers';
import { SystemsResolvers } from './systems/resolvers';
import { UsersResolvers } from './users/resolvers';

export const resolvers = [UsersResolvers, MobShipSResolvers, SystemsResolvers, DestinationsResolvers];
