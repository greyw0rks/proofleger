# Contributing to ProofLedger

## Repository Structure

```
proofleger/           Next.js app (frontend)
proofleger-contracts/ Clarity smart contracts (Stacks)
proofleger-verifier/  Node.js indexer + API (backend)
```

## Commit Convention

All commits follow this pattern:

```
<type>(<scope>): <short description>

Types: Add | Refactor | Fix | Update | Remove | Docs
Scope: contract name, module name, or page name
```

Examples:
```
Add useVerify: multi-chain hash verification hook
Refactor AnchorForm: integrate multi-step flow
Fix proof-nft: correct token-id increment
```

## Contracts

- All contracts live in `contracts/`
- Tests in `tests/` using Clarinet SDK + Vitest
- Run tests: `clarinet test`
- Check: `clarinet check`

## Verifier

- Node.js 20+, ES modules
- `node src/indexer.js` — start Stacks indexer
- `node src/query.js stats` — full system stats
- `node src/api-v2.js` — start API server

## App

- Next.js 14, App Router, TypeScript optional
- `npm run dev` — development server
- All components in `src/components/`
- All hooks in `src/hooks/`

## Pull Requests

1. Branch from `main`
2. One feature or fix per PR
3. Include tests for contract changes
4. Update `CHANGELOG.md` in the relevant repo