const store = new Map();

export async function cacheWrap(key, fn, ttlMs = 60_000) {
  const existing = store.get(key);
  if (existing && Date.now() < existing.expires) return existing.value;
  const value = await fn();
  store.set(key, { value, expires: Date.now() + ttlMs });
  return value;
}

export function cacheGet(key) {
  const e = store.get(key);
  if (!e || Date.now() >= e.expires) return null;
  return e.value;
}

export function cacheSet(key, value, ttlMs = 60_000) {
  store.set(key, { value, expires: Date.now() + ttlMs });
}

export function cacheInvalidate(key) {
  store.delete(key);
}

export function cacheClear() {
  store.clear();
}

export function cacheStats() {
  const now = Date.now();
  let active = 0;
  store.forEach(v => { if (now < v.expires) active++; });
  return { total: store.size, active };
}