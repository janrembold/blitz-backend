import { gql } from 'apollo-server-express';

export const UsersTypeDefs = gql`
  type Destination {
    system_id: Int!
    destination_id: Int!
  }

  extend type Mutation {
    login(email: String!, password: String!): String!
  }

  extend type Query {
    getUserDestination: Destination!
  }
`;

export interface DestinationResponse {
  system_id: number;
  destination_id: number;
}
