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

  extend type Query {
    getAllSystems: [System!]!
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
