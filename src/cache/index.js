import cacheManager from 'cache-manager';
import redisStore from 'cache-manager-redis';
import {TimeoutError, createTimeoutPromise, groupBy} from '../helpers';

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

const CACHE_WAIT_TIME = 500; // wait 500 ms before giving up on the cache

// Foreach item, if I've got it put it in found otherwise it's in missing
export async function tryCacheForeach(items, namespace) {
  let promises = items.map((x) => {
    let key = [namespace, x];
    key = key.map(JSON.stringify).join('-').replace(/\"/g, '');

    return createTimeoutPromise(
        redisCache.get(key), CACHE_WAIT_TIME)
        .catch((x) => false);
  });

  let results = await Promise.all(promises);
  return groupBy(
    results,
    (x) => x ? 'found': 'missing'
  );
}

export function cacheItems(items, namespace) {
  for(let item of items) {
    let key = [namespace, item.key];
    key = key.map(JSON.stringify).join('-').replace(/\"/g, '');
    redisCache.set(key, item.value);
  }
}

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
