import { getAllMobShipPositionsBySystemId, insertMobShips } from '../../models/MobShipPositions';
import { getMobShipCount } from '../../models/MobShips/getMobShipCount';
import { getSystemById } from '../../models/Systems';
import { getRandomWorldPosition } from '../../utils/getRandomWorldPosition';

export const getAllMobShipsInSystem = async (systemId: number) => {
  // System Infos checken
  const system = getSystemById(systemId);

  // ToDo: update an generelle oder spezifische config binden
  updateDefaultMobShipSystem(system);

  return getAllMobShipPositionsBySystemId(systemId);
};

const updateDefaultMobShipSystem = async (system: any) => {
  const { id } = system;
  const maxMobShipCount = 20;

  const mobShipCount = await getMobShipCount(id);
  const missingShipCount = maxMobShipCount - mobShipCount;

  if (missingShipCount > 0) {
    const newShips = createMobShips(missingShipCount);
    await insertMobShips(newShips);
  }
};

const createMobShips = (count: number) => {
  const newShips = [];

  for (let i = 0; i < count; i++) {
    newShips.push(createMobShip());
  }

  return newShips;
};

const createMobShip = () => {
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

  // format: [mob_ship_id, speed, routing_points]
  return [1, 10, JSON.stringify({ route: routingPoints })];
};
