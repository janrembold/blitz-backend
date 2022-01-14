import { gql } from 'apollo-server-express';

export const UsersTypeDefs = gql`
  type User {
    id: String!
    name: String!
    timezone: String!
    created_at: timestamptz!
  }

  type Destination {
    system_id: Int!
    x: Int!
    y: Int!
  }

  extend type Mutation {
    login(email: String!, password: String!): String!
  }

  extend type Query {
    myDestination: Destination!
  }
`;

export interface DestinationResponse {
  system_id: number;
  x: number;
  y: number;
}
