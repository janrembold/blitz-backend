import { MobShipSResolvers } from './MobShips/resolvers';
import { SystemsResolvers } from './Systems/resolvers';
import { UsersResolvers } from './Users/resolvers';

export const resolvers = [UsersResolvers, MobShipSResolvers, SystemsResolvers];
