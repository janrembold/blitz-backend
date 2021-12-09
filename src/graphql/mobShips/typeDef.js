import { gql } from 'apollo-server-express';

export const MobShipsTypeDefs = gql`
  type MobShip {
    id: Int!
    name: String!
    routing_points: Json!
  }

  extend type Query {
    getAllMobShipsInSystem(systemId: Int!): [MobShip!]!
  }

  extend type Subscription {
    updateMobShip(systemId: Int!): MobShip!
  }
`;
