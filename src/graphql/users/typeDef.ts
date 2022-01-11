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
    planet_id: Int!
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
  planet_id: number;
}
