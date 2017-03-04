import cacheManager from 'cache-manager';
import redisStore from 'cache-manager-redis';

const redisCache = cacheManager.caching({
    store: redisStore,
    host: process.env.REDIS_HOST || 'localhost', // default value
    port: 6379, // default value
    db: 0,
    ttl: 1360800,
});

const DEFAULT_OPTS = {
  context: null,
  namespace: '',
};

export function createCachedFunction(func, opts=DEFAULT_OPTS) {
  opts = Object.assign({}, DEFAULT_OPTS, opts);
  return (...args) => {
    let key = [opts.namespace, func.name].concat(args);
    key = key.map(JSON.stringify).join('-');

    return redisCache.wrap(key, () => {
      if(opts.context != null) {
        return func.apply(opts.context, args);
      } else {
        return func(args);
      }
    });
  };
}
