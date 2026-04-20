export async function withRetry(fn, options = {}) {
  const {
    maxAttempts = 3,
    baseDelayMs  = 1000,
    maxDelayMs   = 10000,
    shouldRetry  = (e) => !e?.message?.includes("rejected"),
  } = options;

  let lastError;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch(e) {
      lastError = e;
      if (attempt === maxAttempts || !shouldRetry(e)) throw e;
      const delay = Math.min(baseDelayMs * 2 ** (attempt - 1), maxDelayMs);
      const jitter = Math.random() * 500;
      await new Promise(r => setTimeout(r, delay + jitter));
    }
  }
  throw lastError;
}

export function retryFetch(url, options = {}, retryOptions = {}) {
  return withRetry(() => fetch(url, options).then(r => {
    if (r.status === 429) throw new Error("Rate limited");
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    return r.json();
  }), retryOptions);
}