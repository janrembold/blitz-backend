import PgBoss from 'pg-boss';

let boss: PgBoss | undefined;
export const initQueue = async (connectionString: string) => {
  if (!boss) {
    boss = new PgBoss(connectionString);

    boss.on('error', (error) => {
      console.error(error);
      process.exit(-1);
    });

    await boss.start();

    console.info('Boss queue initialized');
  }
};

export const getQueue = () => {
  if (!boss) {
    throw new Error('PG Boss queue not initiated');
  }

  return boss;
};

export const publishToQueue = (queue: string, data: object, options: PgBoss.PublishOptions = {}) =>
  getQueue().publish(queue, data, options);

export const subscribeToQueue = (queue: string, callback: PgBoss.SubscribeHandler<unknown, unknown>) =>
  getQueue().subscribe(queue, callback);

export const stopQueue = () => getQueue().stop();
