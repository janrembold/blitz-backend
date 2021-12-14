import { subscribeToQueue } from '../boss';
import { mobShipRemove } from './mobShipRemove';

export const initAllSubscriptions = () => {
  subscribeToQueue('mob-ship-remove-*', mobShipRemove);

  console.log('Boss subscriptions listening');
};
