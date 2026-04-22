# ProofLedger Anchor Flow

## Steps

1. **Select file** — any file type, hashed SHA-256 client-side, never uploaded
2. **Choose network** — Stacks (Bitcoin L2) or Celo
3. **Add title and type** — human-readable label and document category
4. **Sign in wallet** — Hiro Wallet (Stacks) or MetaMask/MiniPay (Celo)
5. **Wait for confirmation** — ~10min Stacks, ~5sec Celo

## What Gets Stored On-Chain

```
hash:    SHA-256 of your document (32 bytes)
title:   Human-readable label (max 100 ASCII chars)
docType: diploma | certificate | research | contribution | award | art | other
owner:   Your wallet address
block:   Bitcoin or Celo block height at anchoring time
```

## Large File Support

Files over 5MB are hashed in 2MB chunks to avoid blocking the browser UI.
Progress is shown while hashing.

## Verification

Any document can be verified at any time:
- By hash: paste the SHA-256 hex string
- By file: re-upload the original file

ProofLedger checks both Stacks and Celo simultaneously and shows a MultiChainBadge.