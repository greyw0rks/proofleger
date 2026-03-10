# Contributing to ProofLedger

ProofLedger is a Bitcoin-native credential layer built on Stacks.

## Setup

1. Clone the repo
2. Run npm install
3. Copy .env.example to .env.local
4. Run npm run dev

## Contract Interaction

All contract calls are in src/lib/wallet.js.
Contracts are deployed on Stacks mainnet.
Use Hiro wallet to interact via the UI.

## Architecture

Frontend: Next.js on Vercel
Contracts: Clarity on Stacks mainnet
Anchoring: SHA-256 hashes stored on Bitcoin via Stacks

## Pull Requests

Open PRs against the main branch.
Include a description of what changed and why.
