import { gql } from 'apollo-server-express';

export const DestinationsTypeDefs = gql`
  type Destination {
    id: Int!
    name: String!
    type: String!
    asset_key: String!
    x: Int!
    y: Int!
  }

  extend type Query {
    getSystemDestinations(systemId: Int!): [Destination!]!
  }
`;

export interface DestinationResponse {
  id: number;
  name: string;
  type: string;
  asset_key: string;
  x: number;
  y: number;
}
