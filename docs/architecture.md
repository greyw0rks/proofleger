# ProofLedger Architecture

## Overview

ProofLedger is a document proof-of-existence system built on Stacks/Bitcoin.

## Components

### Frontend (Next.js 16)
- App Router with React Server Components
- Client-side SHA-256 hashing via Web Crypto API
- Hiro Wallet integration via @stacks/connect v8
- Celo/MiniPay integration via viem

### Smart Contracts (Clarity)
- `proofleger3` — core document anchoring
- `credentials` — verifiable credential issuance
- `achievements` — soulbound NFTs
- `endorsements` — social endorsements
- `profiles` — on-chain profile storage

### Infrastructure
- Vercel (frontend deployment)
- AWS EC2 (bot infrastructure)
- PM2 (process management)
- Stacks Mainnet (L2 settlement)
- Bitcoin (final settlement)

## Data Flow

```
User selects file
→ Browser computes SHA-256 (never uploaded)
→ User signs transaction with Hiro Wallet
→ Stacks broadcasts to network
→ Anchored to Bitcoin block
→ ProofLedger Verifier indexes and verifies
```
