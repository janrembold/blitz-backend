import { gql } from 'apollo-server-express';

export const UsersTypeDefs = gql`
  extend type Mutation {
    login(email: String!, password: String!): String
  }
`;
