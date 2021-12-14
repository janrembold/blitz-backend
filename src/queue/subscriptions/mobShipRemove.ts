import { removeMobShipPosition } from '../../models/MobShips/removeMobShipPosition';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const mobShipRemove = async (job: any) => {
  console.log('mob ship remove subscription', job);
  const id = job.data.mobShipPosition?.id;

  if (id) {
    await removeMobShipPosition(id);

    // ToDo: send GraphQl subscription update to remove mob ship
  }
};
