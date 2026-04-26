# ProofLedger Verifier API v2

Base URL: `https://verify.proofleger.vercel.app`

## Endpoints

### `GET /v2/health`
Service health check.
```json
{ "status": "ok", "ts": "2026-04-30T12:00:00Z" }
```

### `GET /v2/verify/:hash`
Check if a hash is anchored on Stacks or Celo.
- `?chain=stacks|celo|all` (default: all)

```json
{ "found": true, "chain": "stacks", "data": { ... } }
```

### `GET /v2/stats`
Protocol-wide statistics.
```json
{ "stacks": { "total_anchors": 1200 }, "celo": { "total": 340 } }
```

### `GET /v2/search?q=<term>`
Full-text search across hashes, titles, addresses.
- `&chain=stacks|celo|all`
- `&offset=0`

### `GET /v2/wallet/:address`
All proofs for a wallet on both chains.

### `GET /v2/recent?limit=20`
Most recent proof submissions across both chains.

### `GET /v2/reputation/:address`
On-chain reputation score for an address.

### `GET /v2/leaderboard?limit=10`
Top wallets ranked by anchor count and score.

### `GET /v2/leaderboard/reputation`
Top wallets ranked by reputation score.

### `GET /v2/delegation/:address`
Active delegations for a delegator or delegate.

### `GET /v2/mirror/:hash`
Cross-chain mirror status for a Stacks hash.

### `GET /v2/stake/:address`
Active staking position for an address.

## Rate Limits

60 requests per minute per IP.
Headers: `X-RateLimit-Remaining`, `X-RateLimit-Reset`

## Cache Headers

Hot endpoints (`/verify`, `/stats`, `/leaderboard`) return
`Cache-Control: public, max-age=30` for CDN caching.