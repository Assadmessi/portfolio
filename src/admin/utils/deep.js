export function deepClone(obj) {
  return obj ? JSON.parse(JSON.stringify(obj)) : obj;
}

export function deepEqual(a, b) {
  try {
    return JSON.stringify(a) === JSON.stringify(b);
  } catch {
    return false;
  }
}
