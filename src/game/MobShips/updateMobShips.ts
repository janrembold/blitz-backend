import { System } from '../../graphql/Systems/typeDef';
import { insertMobShips } from '../../models/MobShips/getAllMobShipPositionsBySystemId';
import { getMobShipCount } from '../../models/MobShips/getMobShipCount';
import { getRandomWorldPosition } from '../../utils/getRandomWorldPosition';

export const updateMobShips = async (system: System) => {
  const { id } = system;

  /**
   * ToDo: update by system.mob_type
   * - Add getMobShips() method with cache manager ttl: 3600
   * - Select mob_type from this result
   */
  const maxMobShipCount = 20;

  const mobShipCount = await getMobShipCount(id);
  const missingShipCount = maxMobShipCount - mobShipCount;

  // ToDo: update not always - choose random by threshold
  if (missingShipCount > 0) {
    const newShips = createMobShips(missingShipCount, id);
    await insertMobShips(newShips);
  }
};

const createMobShips = (count: number, systemId: number) => {
  const newShips = [];

  for (let i = 0; i < count; i++) {
    newShips.push(createMobShip(systemId));
  }

  return newShips;
};

const createMobShip = (systemId: number) => {
  const routingPointCount = 20;
  const routingPoints: [number, number][] = [];

  /**
   * ToDo:
   * - start with outer border position and move on with safe area border - no random world position
   * - get speed from balance config
   */

  for (let index = 0; index < routingPointCount; index++) {
    const { x, y } = getRandomWorldPosition();
    routingPoints.push([x, y]);
  }

  // format: [mob_ship_id, system_id, speed, routing_points]
  return [1, systemId, 10, JSON.stringify({ route: routingPoints })];
};
