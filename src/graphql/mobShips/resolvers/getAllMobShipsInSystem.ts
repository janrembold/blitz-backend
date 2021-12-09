import { getAllMobShipPositionsBySystemId, insertMobShips } from '../../../models/MobShipPositions';
import { getMobShipCount } from '../../../models/MobShips/getMobShipCount';
import { getSystemById } from '../../../models/Systems';
import { getRandomWorldPosition } from '../../../utils/getRandomWorldPosition';

export const getAllMobShipsInSystem = async (systemId: number) => {
  const system = getSystemById(systemId);
  const maxMobShipCount = system.max_mobship_count;

  const mobShipCount = await getMobShipCount(systemId);
  const missingShipCount = maxMobShipCount - mobShipCount;

  if (missingShipCount > 0) {
    const newShips = createMobShips(missingShipCount);
    await insertMobShips(newShips);
  }

  return getAllMobShipPositionsBySystemId(systemId);
};

const createMobShips = (count: number) => {
  const newShips = [];

  for (let foo = 0; foo < count; foo++) {
    newShips.push(createMobShip());
  }

  return newShips;
};

const createMobShip = () => {
  const routingPointCount = 2;
  const routingPoints: [number, number][] = [];

  for (let index = 0; index < routingPointCount; index++) {
    const { x, y } = getRandomWorldPosition();
    routingPoints.push([x, y]);
  }

  return [1, JSON.stringify({ route: routingPoints })];
};
