import cacheManager from 'cache-manager';
import redisStore from 'cache-manager-redis';
import {TimeoutError, createTimeoutPromise} from '../helpers';

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

const CACHE_WAIT_TIME = 200; // wait 200 ms before giving up on the cache


export function createCachedFunction(func, opts=DEFAULT_OPTS) {
  opts = Object.assign({}, DEFAULT_OPTS, opts);
  return async (...args) => {
    let key = [opts.namespace, func.name].concat(args);
    key = key.map(JSON.stringify).join('-');

    func = func.bind(opts.context, ...args);

    try {
      return await createTimeoutPromise(
        redisCache.wrap(key, func), CACHE_WAIT_TIME);
    } catch (e) {
      if (e instanceof TimeoutError) {
        return func();
      } else {
        throw e;
      }
    }
  };
}
