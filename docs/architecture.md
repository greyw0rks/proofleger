# ProofLedger Architecture

## Overview

ProofLedger is a three-layer system for anchoring and verifying documents
on multiple blockchains.

```
┌──────────────────────────────────────┐
│           Frontend (Next.js)         │
│  proofleger.vercel.app               │
│  • AnchorForm → FileDropZone + Hash  │
│  • VerifyForm → multi-chain check    │
│  • Dashboard, History, Search pages  │
└──────────────┬───────────────────────┘
               │ STX + Celo transactions
┌──────────────▼───────────────────────┐
│         Smart Contracts              │
│  Stacks: proofleger3.clar            │
│  Stacks: proof-nft.clar              │
│  Stacks: issuer-registry.clar        │
│  Stacks: proof-batch.clar            │
│  Celo:   ProofLedger.sol (chainId 42220) │
└──────────────┬───────────────────────┘
               │ event polling
┌──────────────▼───────────────────────┐
│      Verifier / Indexer (Node.js)    │
│  verify.proofleger.vercel.app        │
│  AWS Ubuntu — tmux: verifier/api     │
│  • Indexer syncs Stacks + Celo       │
│  • SQLite: proofs.db                 │
│  • API v2: /v2/verify/:hash          │
│  • Scheduler: 2pm 5pm 9pm daily      │
└──────────────────────────────────────┘
```

## Key Data Flows

### Anchoring
1. User drops file → client-side SHA-256 hash computed
2. `AnchorForm` calls contract via Stacks.js or viem (Celo)
3. Transaction confirmed on-chain
4. Verifier indexes the event within the next polling cycle

### Verification
1. User pastes hash or drops file
2. `VerifyForm` calls `GET /v2/verify/:hash`
3. Verifier checks both `proofs` and `celo_proofs` tables
4. Returns structured result with chain, block, issuer, doc type

### Bots
- 160-wallet Stacks pool: submits circular anchors, runs 1am/1pm
- 160-wallet Celo pool: mirrors Stacks pool, runs 1am/1pm
- Single-agent verifier bot: re-verifies unverified rows, 2pm/5pm/9pm

## Environment

| Variable | Description |
|---|---|
| `STACKS_CONTRACT` | Stacks mainnet deployer address |
| `CELO_RPC` | `https://feth.celo.org` |
| `NEXT_PUBLIC_VERIFIER_API` | Verifier API base URL |
| `CELO_AGENT_KEY` | Celo bot funding wallet private key |