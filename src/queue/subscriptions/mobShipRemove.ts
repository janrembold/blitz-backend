import { removeMobShipPosition } from '../../models/MobShips/removeMobShipPosition';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const mobShipRemove = async (job: any) => {
  const id = job.data.mobShipPosition.id;
  console.log('remove mob ship', id);

  if (id) {
    await removeMobShipPosition(id);

    // ToDo: send GraphQl subscription update to remove mob ship
  }
};
