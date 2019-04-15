export default function getEmptyObjectKeys(obj) {
  return Object.keys(obj).reduce((arr, key) => {
    const val = String(obj[key]).trim();

    if (!val) {
      arr.push(key);
    }

    return arr;
  }, []);
}
