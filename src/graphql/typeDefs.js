import { UsersTypeDefs } from './users/typeDef';
import { gql } from 'apollo-server-express';
import { ShipsTypeDefs } from './ships/typeDef';

export const typeDefs = [
  gql`
    type Query
    type Subscription
    type Mutation
  `,
  UsersTypeDefs,
  ShipsTypeDefs,
];
