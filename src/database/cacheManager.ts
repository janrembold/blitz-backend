import cacheManager from 'cache-manager';
export const memoryCache = cacheManager.caching({ store: 'memory', max: 100, ttl: 5 /*seconds*/ });
