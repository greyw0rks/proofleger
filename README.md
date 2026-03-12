# ProofLedger

**Anchor documents to Bitcoin. Prove existence without revealing content.**

ProofLedger lets you compute a SHA-256 hash of any document client-side, then anchor that hash permanently to the Bitcoin blockchain via Stacks. No file is ever uploaded. The proof lives on-chain forever.

Live: [proofleger.vercel.app](https://proofleger.vercel.app)

---

## What it does

- Anchor any document hash to Bitcoin via Stacks
- Verify a document existed at a specific block height
- Attest to documents anchored by others
- Mint soulbound NFT achievements for verified credentials
- Build an on-chain reputation score from your verified documents
- Share a public proof profile at `/profile/[wallet]`
- Export a decentralized CV at `/cv/[wallet]`

---

## Tech Stack

- Next.js 16 (App Router)
- @stacks/connect v8 for wallet integration
- @stacks/transactions for contract calls
- Clarity smart contracts on Stacks mainnet
- Bitcoin-anchored finality

---

## Contracts (Mainnet)

| Contract | Address |
|---|---|
| proofleger3 | SP1SY1E599GN04XRD2DQBKV7E62HYBJR2CT9S5QKK.proofleger3 |
| credentials | SP1SY1E599GN04XRD2DQBKV7E62HYBJR2CT9S5QKK.credentials |
| achievements | SP1SY1E599GN04XRD2DQBKV7E62HYBJR2CT9S5QKK.achievements |

---

## UI Design - Neo-Brutalist

| Token | Value |
|---|---|
| Background | `#0a0a0a` |
| Foreground | `#f5f0e8` |
| Accent | `#F7931A` (Bitcoin orange) |
| Success | `#00ff88` |
| Error | `#ff3333` |
| Border | `3px solid` with `6px 6px 0px` hard shadows |
| Heading font | Archivo Black |
| Body font | Space Grotesk |
| Mono font | Space Mono |

---

## Local Development

```bash
git clone https://github.com/greyw0rks/proofleger.git
cd proofleger
npm install
npm run dev
```

Requires Hiro Wallet browser extension.

---

## Project Structure

```
src/
  app/
    page.js                   # Main app (Anchor, Verify, My Records)
    profile/[wallet]/page.js  # Public proof profile
    cv/[wallet]/page.js       # Decentralized CV
  components/
    WalletButton.jsx          # Hiro wallet connect
    ErrorBoundary.jsx         # Runtime error handling
    SkeletonCard.jsx          # Loading skeletons
  lib/
    wallet.js                 # All blockchain interactions
  utils/
    formatters.js             # Display formatting helpers
    validators.js             # Input validation
```

---

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) · [SECURITY.md](./SECURITY.md) · [ROADMAP.md](./ROADMAP.md)
