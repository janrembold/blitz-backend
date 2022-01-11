import { gql } from 'apollo-server-express';

// id BIGSERIAL PRIMARY KEY,
//     mob_ship_id INT NOT NULL,
//     system_id INT NOT NULL,
//     routing_points JSONB NOT NULL,
//     speed INT NOT NULL,
//     blocked BOOLEAN DEFAULT FALSE,
//     created_at

export const MobShipsTypeDefs = gql`
  type MobShip {
    id: Int!
    asset_key: String!
    type: String!
  }

  type MobShipPosition {
    id: Int!
    mob_ship: MobShip!
    system_id: Int!
    routing_points: Json!
    speed: Int!
    blocked: Boolean!
    created_at: timestamptz!
  }

  extend type Subscription {
    updateMobShip(systemId: Int!): MobShip!
  }
`;

export type RoutingPoint = [x: number, y: number];

export interface MobShip {
  id: number;
  asset_key: string;
  type: string;
}

export interface MobShipPosition {
  id: number;
  mobShip: MobShip;
  system_id: number;
  routing_points: RoutingPoint[];
  speed: number;
  blocked: boolean;
  created_at: string;
}
