# ProofLedger API Routes

## GET /api/proof?hash={sha256}
Verify a single document hash.

## POST /api/verify
Batch verify up to 20 hashes.
```json
{ "hashes": ["a1b2...", "c3d4..."] }
```

## GET /api/stats
Protocol statistics.

## GET /api/profile?address={SP...}
Wallet proof profile.

## GET /api/reputation?address={SP...}
Compute wallet reputation score and tier.

## GET /api/search?wallet={SP...}
Search proofs by wallet address.

## POST /api/hash
Server-side SHA-256 of text content.
```json
{ "text": "my document" }
```