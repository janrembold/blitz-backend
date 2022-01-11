import { gql } from 'apollo-server-express';
import { MobShip } from '../MobShips/typeDef';

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

  type SystemWithItems {
    id: Int!
    name: String!
    type: String!
    asset_key: String!
    level: Int!
    x: Int!
    y: Int!
    planets: [Planet]!
    stations: [Station!]!
    mines: [Mine!]!
    mobShips: [MobShipPosition!]!
  }

  type Planet {
    id: Int!
    name: String!
    type: String!
    asset_key: String!
    x: Int!
    y: Int!
    users: [User!]!
  }

  type Station {
    id: Int!
    name: String!
    type: String!
    asset_key: String!
    x: Int!
    y: Int!
  }

  type Mine {
    id: Int!
    type: String!
    asset_key: String!
    capacity: Int!
    min_capacity: Int!
    max_capacity: Int!
    x: Int!
    y: Int!
    user: User
  }

  extend type Query {
    system(id: Int!): SystemWithItems!
    systems: [System!]!
  }
`;

export interface System {
  id: number;
  name: string;
  type: string;
  mob_type: string;
  asset_key: string;
  level: number;
  x: number;
  y: number;
}

export interface SystemWithItems extends System {
  planets: Planet[];
  mines: Mine[];
  stations: Station[];
  mobShips: MobShip[];
}

export interface Planet {
  id: number;
  name: string;
  type: string;
  asset_key: string;
  x: number;
  y: number;
}

export interface Station {
  id: number;
  name: string;
  type: string;
  asset_key: string;
  x: number;
  y: number;
}

export interface Mine {
  id: number;
  type: string;
  asset_key: string;
  capacity: number;
  min_capacity: number;
  max_capacity: number;
  x: number;
  y: number;
}
