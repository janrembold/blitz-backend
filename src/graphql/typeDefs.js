import { UsersTypeDefs } from './users/typeDef';
import { gql } from 'apollo-server-express';

export const typeDefs = [
  gql`
    type Query
    type Subscription
    type Mutation
  `,
  UsersTypeDefs,
];
