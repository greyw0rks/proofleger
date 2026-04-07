# ProofLedger Contracts

## Deployed Addresses (Mainnet)

| Contract | Address |
|---|---|
| proofleger3 | `SP1SY1E599GN04XRD2DQBKV7E62HYBJR2CT9S5QKK.proofleger3` |
| credentials | `SP1SY1E599GN04XRD2DQBKV7E62HYBJR2CT9S5QKK.credentials` |
| achievements | `SP1SY1E599GN04XRD2DQBKV7E62HYBJR2CT9S5QKK.achievements` |

## Anchoring a Document

```javascript
import { anchorDocument } from "@/lib/wallet";

const txId = await anchorDocument(
  "a1b2c3...", // SHA-256 hash
  "My Diploma", // title
  "diploma"     // doc type
);
```

## Verifying

```javascript
import { verifyDocument } from "@/lib/wallet";

const proof = await verifyDocument("a1b2c3...");
// Returns { owner, block-height, title, doc-type } or null
```
