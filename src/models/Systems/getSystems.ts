import { MemoryCacheKeys } from '../../constants/MemoryCacheKeys';
import { memoryCache } from '../../database/cacheManager';
import { getPgClient } from '../../database/postgres';
import { System } from '../../graphql/Systems/typeDef';

export const getSystems = async (): Promise<System[]> => {
  try {
    return await memoryCache.wrap(MemoryCacheKeys.SYSTEMS, getAllSystemsPromise, { ttl: 3600 });
  } catch (error) {
    console.error('getAllSystems', error);
  }

  throw new Error('Error loading systems');
};

const getAllSystemsPromise = async (): Promise<System[]> => {
  const pg = getPgClient();
  const res = await pg.query('SELECT * FROM systems;');

  return res.rows as System[];
};
