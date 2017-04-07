import ExtendableError from 'es6-error';

export class TroubadourError extends ExtendableError {
 constructor(message = '', status=500) {
   super(message);
   this.status = status;
 }
}

export class TimeoutError extends ExtendableError {
  constructor(message='Execution of this function took too long.') {
    super(message);
  }
}

export function groupBy(array, keyFunc=(x)=> x, valueFunc=(x)=> x) {
  // returns an object of {key: []} where key is returned by keyFunc
  return array.reduce((obj, current) => {
    let key = keyFunc(current);
    if(!(key in obj)) {
      obj[key] = [];
    }
    obj[key].push(valueFunc(current));
    return obj;
  }, {});
}

export async function createTimeoutPromise(promise, timeout=30) {
  let timeoutPromise = new Promise((resolve, reject) => {
    setTimeout(reject, timeout,
      new TimeoutError(`Execution took longer than ${timeout}`));
  });
  return Promise.race([promise, timeoutPromise]);
}
