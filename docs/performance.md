# ProofLedger Performance Guide

## Rate Limiting

The Hiro API free tier allows ~1 request/second.
Use the built-in rate limiter for batched operations:

```javascript
import { rateLimit } from "@/lib/rate-limiter";

const result = await rateLimit("hiro-api", () =>
  fetch("https://api.hiro.so/v2/accounts/SP...?proof=0")
);
```

## Caching

Use the cache lib to avoid repeat API calls:

```javascript
import { cacheWrap } from "@/lib/cache";

const profile = await cacheWrap(
  `profile:${address}`,
  () => buildProfile(address),
  60_000  // cache for 60 seconds
);
```

## Retry Logic

```javascript
import { withRetry } from "@/lib/retry";

const data = await withRetry(
  () => fetch("https://api.hiro.so/...").then(r => r.json()),
  { maxAttempts: 3, baseDelay: 1000 }
);
```

## Best Practices

- Always add 500ms delay between balance checks
- Use `?unanchored=true` for nonce queries
- Cache read-only contract calls for 60s
- Batch verify multiple hashes in one POST to `/api/verify`