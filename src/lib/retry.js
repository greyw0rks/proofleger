export async function withRetry(fn, options = {}) {
  const { maxAttempts = 3, baseDelay = 1000, onError } = options;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch(e) {
      if (attempt === maxAttempts) throw e;
      onError?.(e, attempt);
      const delay = baseDelay * Math.pow(2, attempt - 1) + Math.random() * 500;
      await new Promise(r => setTimeout(r, delay));
    }
  }
}

export async function withTimeout(fn, ms = 10000) {
  return Promise.race([
    fn(),
    new Promise((_, reject) => setTimeout(() => reject(new Error(`Timeout after ${ms}ms`)), ms)),
  ]);
}