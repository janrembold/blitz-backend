import { gql } from 'apollo-server-express';

export const SystemsTypeDefs = gql`
  type System {
    id: Int!
    name: String!
    type: String!
    asset_key: String!
    level: Int!
    x: Int!
    y: Int!
  }

  type Destination {
    id: Int!
    name: String!
    type: String!
    asset_key: String!
    x: Int!
    y: Int!
  }

  type SystemDetails {
    id: Int!
    name: String!
    type: String!
    asset_key: String!
    level: Int!
    x: Int!
    y: Int!
    destinations: [Destination!]!
  }

  extend type Query {
    getAllSystems: [System!]!
    getSystemDetails(systemId: Int!): SystemDetails!
  }
`;

export interface SystemResponse {
  id: number;
  name: string;
  type: string;
  asset_key: string;
  level: number;
  x: number;
  y: number;
}
