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
