export function deepClone(obj) {
  if (obj === null || typeof obj !== "object") return obj;
  if (Array.isArray(obj)) return obj.map(deepClone);
  return Object.fromEntries(Object.entries(obj).map(([k,v]) => [k, deepClone(v)]));
}

export function deepMerge(target, source) {
  const result = { ...target };
  for (const key of Object.keys(source)) {
    if (source[key] && typeof source[key] === "object" && !Array.isArray(source[key])) {
      result[key] = deepMerge(result[key] || {}, source[key]);
    } else {
      result[key] = source[key];
    }
  }
  return result;
}

export function pick(obj, keys) {
  return Object.fromEntries(keys.filter(k => k in obj).map(k => [k, obj[k]]));
}

export function omit(obj, keys) {
  return Object.fromEntries(Object.entries(obj).filter(([k]) => !keys.includes(k)));
}

export function isEmpty(obj) {
  if (!obj) return true;
  if (Array.isArray(obj)) return obj.length === 0;
  return Object.keys(obj).length === 0;
}