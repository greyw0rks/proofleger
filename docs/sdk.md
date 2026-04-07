# ProofLedger SDK

## Installation

```bash
npm install proofleger-sdk
```

## Quick Start

```javascript
const { hashFile, verifyDocument, calculateReputation } = require("proofleger-sdk");

// Hash a file (browser only, requires HTTPS)
const hash = await hashFile(file);

// Verify on-chain (no wallet needed)
const proof = await verifyDocument(hash);
if (proof) {
  console.log("Anchored at block:", proof.blockHeight);
}

// Calculate reputation
const rep = calculateReputation([
  { docType: "diploma", attestations: 2, hasNFT: true }
]);
console.log(rep.tier); // "Contributor"
```

## API

See [npmjs.com/package/proofleger-sdk](https://npmjs.com/package/proofleger-sdk) for full API reference.
