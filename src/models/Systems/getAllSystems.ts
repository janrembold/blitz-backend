import { MemoryCacheKeys } from '../../constants/MemoryCacheKeys';
import { memoryCache } from '../../database/cacheManager';
import { getPgClient } from '../../database/postgres';
import { SystemResponse } from '../../graphql/systems/typeDef';

export const getAllSystems = async (): Promise<SystemResponse[]> => {
  try {
    return await memoryCache.wrap(MemoryCacheKeys.SYSTEMS, getAllSystemsPromise, { ttl: 3600 });
  } catch (error) {
    console.error('getAllSystems', error);
  }

  throw new Error('Error loading systems');
};

const getAllSystemsPromise = async (): Promise<SystemResponse[]> => {
  const pg = getPgClient();
  const res = await pg.query('SELECT * FROM systems;');

  return res.rows as SystemResponse[];
};
