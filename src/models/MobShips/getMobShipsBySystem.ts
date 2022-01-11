import { updateMobShips } from '../../game/MobShips/updateMobShips';
import { System } from '../../graphql/Systems/typeDef';
import { getAllMobShipPositionsBySystemId } from './getAllMobShipPositionsBySystemId';

export const getMobShipsBySystem = async (system: System) => {
  updateMobShips(system);

  return await getAllMobShipPositionsBySystemId(system.id);
};
