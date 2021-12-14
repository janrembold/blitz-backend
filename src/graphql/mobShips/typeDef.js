import { gql } from 'apollo-server-express';

export const MobShipsTypeDefs = gql`
  type MobShip {
    id: Int!
    name: String!
    speed: Int!
    routing_points: Json!
    created_at: String!
  }

  extend type Query {
    getAllMobShipsInSystem(systemId: Int!): [MobShip!]!
  }

  extend type Subscription {
    updateMobShip(systemId: Int!): MobShip!
  }
`;
