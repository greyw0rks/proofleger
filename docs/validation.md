# ProofLedger Input Validation

## Validate Before Anchoring

```javascript
import { validateProofInput, sanitizeTitle, normalizeHash } from "@/lib/proof-validator";

const { valid, errors } = validateProofInput({
  hash: "a1b2c3...",
  title: "My Diploma",
  docType: "diploma",
});

if (!valid) console.log(errors);
// { hash: null, title: null, docType: null } — all good
```

## Sanitize User Input

```javascript
const safeTitle = sanitizeTitle("  My Document™  ");
// "My Document"

const cleanHash = normalizeHash("0xA1B2C3...");
// "a1b2c3..." (no 0x prefix, lowercase)
```

## Address Validation

```javascript
import { isStacksAddress, isCeloAddress, shortenAddress } from "@/utils/address";

isStacksAddress("SP1SY1..."); // true
isCeloAddress("0x251B..."); // true
shortenAddress("SP1SY1E599GN04XRD2DQBKV7E62HYBJR2CT9S5QKK");
// "SP1SY1...QKK"
```