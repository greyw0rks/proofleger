const queues = new Map();

export function createRateLimiter(key, requestsPerSecond = 2) {
  const intervalMs = 1000 / requestsPerSecond;
  if (!queues.has(key)) queues.set(key, { lastRun: 0, timer: null });

  return async function limited(fn) {
    const q = queues.get(key);
    const now = Date.now();
    const wait = Math.max(0, q.lastRun + intervalMs - now);
    if (wait > 0) await new Promise(r => setTimeout(r, wait));
    q.lastRun = Date.now();
    return fn();
  };
}

// Pre-built limiter for Hiro API (3 req/sec)
export const hiroLimited = createRateLimiter("hiro", 3);

// Pre-built limiter for Celo RPC (5 req/sec)
export const celoLimited = createRateLimiter("celo", 5);