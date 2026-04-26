# ProofLedger Verification Flow

## Overview

Verification checks whether a document hash exists on Stacks or Celo.
The check runs against both chains in parallel via the verifier API.

## Hash a Document

```javascript
import { hashFile, hashText } from "@/utils/hash";

// From a browser File object
const hash = await hashFile(file, (progress) => console.log(progress + "%"));

// From a text string
const hash = await hashText("document content here");
```

Both return a lowercase 64-char hex string (no `0x` prefix).

## Verify via API

```bash
GET https://verify.proofleger.vercel.app/v2/verify/<hash>
```

Response when found:

```json
{
  "found": true,
  "chain": "stacks",
  "data": {
    "hash": "abc123...",
    "title": "MIT Diploma 2026",
    "doc_type": "diploma",
    "sender": "SP1SY...",
    "block_height": 158432,
    "verified": 1
  }
}
```

Response when not found:

```json
{ "found": false, "chain": "all" }
```

## React Hook

```javascript
import { useVerify } from "@/hooks/useVerify";

const { verify, result, loading, error, exists } = useVerify();
await verify("abc123...");
// result.found, result.chain, result.data
```

## Both Chains

```javascript
const stacks = useVerify();
const celo   = useCeloVerify();

await Promise.all([stacks.verify(hash), celo.verify(hash)]);
// Check stacks.exists && celo.exists independently
```