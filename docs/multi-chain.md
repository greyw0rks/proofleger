# ProofLedger Multi-Chain Architecture

## Networks

| Network | Layer | Currency | Speed | Cost |
|---|---|---|---|---|
| Stacks | Bitcoin L2 | STX | ~10 min | ~0.001 STX |
| Celo | EVM L1 | CELO | ~5 sec | <$0.01 |

## Why Both?

- **Stacks/Bitcoin** — Permanent, censorship-resistant, Bitcoin settlement
- **Celo** — Mobile-first, sub-cent fees, MiniPay compatible

## Document Proof Flow

```
User uploads file
       ↓
SHA-256 hash computed client-side
       ↓
       ├─ Anchor on Stacks (proofleger3 contract)
       │  → settles to Bitcoin ~10 min
       │
       └─ Anchor on Celo (ProofLedger.sol)
          → confirms in ~5 seconds
```

## Contracts

```
Stacks: SP1SY1E599GN04XRD2DQBKV7E62HYBJR2CT9S5QKK.proofleger3
Celo:   0x251B3302c0CcB1cFBeb0cda3dE06C2D312a41735
```

## Multi-Chain Verification

```javascript
import { verifyMultiChain } from "@/lib/multi-chain-verifier";

const result = await verifyMultiChain("sha256hashhere");
// { stacks: true, celo: true, isMultiChain: true }
```

A document with `isMultiChain: true` has been independently anchored on both Bitcoin and Celo, providing maximum verifiability.