import PgBoss from 'pg-boss';

let boss;
export const initQueue = async (connectionString) => {
  if (!boss) {
    boss = new PgBoss(connectionString);

    boss.on('PG Boss error', (error) => {
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

export const publishToQueue = (data, options = {}, queue = 'blitz-queue') =>
  boss.publish(queue, data, options);

export const subscribeToQueue = (callback, queue = 'blitz-queue') => boss.subscribe(queue, callback);
