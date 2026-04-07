const store = new Map();
export function cacheSet(key, value, ttlMs = 60_000) {
  store.set(key, { value, expires: Date.now() + ttlMs });
}
export function cacheGet(key) {
  const entry = store.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expires) { store.delete(key); return null; }
  return entry.value;
}
export function cacheClear(key) {
  if (key) store.delete(key); else store.clear();
}
export async function cacheWrap(key, fn, ttlMs = 60_000) {
  const cached = cacheGet(key);
  if (cached !== null) return cached;
  const result = await fn();
  cacheSet(key, result, ttlMs);
  return result;
}
