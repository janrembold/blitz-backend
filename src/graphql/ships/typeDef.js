import { gql } from 'apollo-server-express';

export const ShipsTypeDefs = gql`
  type ShipPosition {
    shipId: Int!
    x: Int!
    y: Int!
  }

  type Ship {
    id: Int!
    name: String!
    x: Int!
    y: Int!
  }

  extend type Query {
    getShipsInSystem(systemId: Int!): [Ship!]!
  }

  extend type Mutation {
    updateShipPosition(systemId: Int!, shipId: Int!, x: Int!, y: Int!): Boolean
  }

  extend type Subscription {
    newShipPosition: ShipPosition!
  }
`;
