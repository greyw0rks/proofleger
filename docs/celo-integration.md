# ProofLedger Celo Integration

ProofLedger supports dual-chain anchoring — documents can be anchored on both Bitcoin (via Stacks) and Celo.

## Contract

```
Network:  Celo Mainnet (chainId 42220)
Address:  0x251B3302c0CcB1cFBeb0cda3dE06C2D312a41735
```

## Anchor a Document

```javascript
import { useCeloAnchor } from "@/hooks/useCeloAnchor";

const { anchor, loading, txHash } = useCeloAnchor();
await anchor("a1b2c3...", "My Diploma", "diploma");
```

## Verify a Document

```javascript
import { useCeloVerify } from "@/hooks/useCeloVerify";

const { verify, result, isVerified } = useCeloVerify();
await verify("a1b2c3...");
// result: { owner, title, docType, blockNumber, exists }
```

## Multi-Chain Verification

```javascript
import { verifyMultiChain } from "@/lib/multi-chain-verifier";

const { stacks, celo, isMultiChain } = await verifyMultiChain("a1b2c3...");
```

## Live Events

```javascript
import { useCeloEvents } from "@/hooks/useCeloEvents";

const { events, loading } = useCeloEvents(20);
// events: [{ hash, owner, title, docType, blockNumber, txHash }]
```

## API Routes

```bash
GET /api/celo/verify?hash=0xa1b2c3...
GET /api/celo/stats
```

## UI Components

- `<CeloAnchorPanel hash={hash} />` — anchor form
- `<CeloVerifyResult result={result} hash={hash} />` — verification display
- `<CeloActivityFeed limit={20} />` — live event feed
- `<CeloStats />` — contract statistics
- `<NetworkToggle />` — Stacks / Celo switcher
- `<ChainSelector />` — full-size chain selector
- `<MultiChainBadge stacksVerified celo Verified />` — status badge