import { gql } from 'apollo-server-core';
import { MobShipsTypeDefs } from './mobShips/typeDef';
import { SystemsTypeDefs } from './systems/typeDef';
import { UsersTypeDefs } from './users/typeDef';

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
