# ProofLedger Analytics

## Analytics API

```bash
# Protocol overview
GET /api/analytics

# Top contributors
GET /api/leaderboard?limit=20

# Wallet activity
GET /api/wallet/SP1SY1...
```

## React Hooks

```javascript
import { useAnalytics } from "@/hooks/useAnalytics";
import { useLeaderboard } from "@/hooks/useLeaderboard";

const { stats, activeWallets, loading } = useAnalytics();
const { entries, loading } = useLeaderboard(20);
```

## SDK Client

```javascript
import { ProofLedgerClient } from "@/lib/sdk-client";

const proof = await ProofLedgerClient.verify("a1b2c3...");
const network = await ProofLedgerClient.getNetworkInfo();
const txCount = await ProofLedgerClient.getTxCount("SP1SY1...");
```

## Leaderboard Score Formula

```
Score = Anchors × 10 + Attestations × 5 + NFTs × 25
```