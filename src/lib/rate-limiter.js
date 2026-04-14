const queues = new Map();

export function rateLimit(key, fn, intervalMs = 1000) {
  if (!queues.has(key)) queues.set(key, { last: 0, pending: [] });
  const q = queues.get(key);

  return new Promise((resolve, reject) => {
    q.pending.push({ fn, resolve, reject });
    processQueue(key, intervalMs);
  });
}

async function processQueue(key, intervalMs) {
  const q = queues.get(key);
  if (!q || q.processing) return;
  q.processing = true;

  while (q.pending.length > 0) {
    const now = Date.now();
    const wait = Math.max(0, q.last + intervalMs - now);
    if (wait > 0) await new Promise(r => setTimeout(r, wait));

    const { fn, resolve, reject } = q.pending.shift();
    q.last = Date.now();
    try { resolve(await fn()); } catch(e) { reject(e); }
  }

  q.processing = false;
}