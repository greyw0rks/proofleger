export async function mapConcurrent(arr, fn, limit = 5) {
  const results = [];
  for (let i = 0; i < arr.length; i += limit) {
    const batch = arr.slice(i, i + limit);
    const batchResults = await Promise.allSettled(batch.map(fn));
    results.push(...batchResults);
  }
  return results;
}

export async function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

export async function poll(fn, { interval = 3000, maxAttempts = 20, until } = {}) {
  for (let i = 0; i < maxAttempts; i++) {
    const result = await fn();
    if (until ? until(result) : result) return result;
    if (i < maxAttempts - 1) await sleep(interval);
  }
  return null;
}

export function createQueue(concurrency = 1) {
  const queue = [];
  let running = 0;
  function next() {
    while (running < concurrency && queue.length > 0) {
      running++;
      const { fn, resolve, reject } = queue.shift();
      fn().then(resolve).catch(reject).finally(() => { running--; next(); });
    }
  }
  return (fn) => new Promise((resolve, reject) => { queue.push({ fn, resolve, reject }); next(); });
}