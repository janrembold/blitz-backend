import { updateMobShips } from '../../game/MobShips/updateMobShips';
import { System } from '../../graphql/Systems/typeDef';
import { getAllMobShipPositionsBySystemId } from './getAllMobShipPositionsBySystemId';

export const getMobShipsBySystem = async (system: System) => {
  await updateMobShips(system);

  return await getAllMobShipPositionsBySystemId(system.id);
};
