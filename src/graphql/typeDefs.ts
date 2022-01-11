import { gql } from 'apollo-server-core';
import { MobShipsTypeDefs } from './MobShips/typeDef';
import { SystemsTypeDefs } from './Systems/typeDef';
import { UsersTypeDefs } from './Users/typeDef';

export const typeDefs = [
  gql`
    scalar Json
    scalar timestamptz

    type Query
    type Subscription
    type Mutation
  `,
  UsersTypeDefs,
  MobShipsTypeDefs,
  SystemsTypeDefs,
];
