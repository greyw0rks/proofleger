# ProofLedger API Reference

## Endpoints

### GET /api/proof?hash={sha256}
Verify a document hash on-chain.

**Response:**
```json
{ "found": true, "result": "0x..." }
```

### GET /api/stats
Protocol statistics.

**Response:**
```json
{ "contracts": 5, "transactions": 1200, "lastUpdated": "..." }
```

### GET /api/profile?address={SP...}
Wallet proof profile.

**Response:**
```json
{ "address": "SP...", "balance": 1.5, "transactions": [], "total": 42 }
```

## Rate Limits
All endpoints are cached for 60 seconds. Heavy usage should use the Hiro API directly.
