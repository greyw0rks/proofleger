# ProofLedger Verification Pipeline

## Full Verification

```javascript
import { verifyCredentialFull } from "@/lib/credential-verifier";

const result = await verifyCredentialFull("a1b2c3...");
// {
//   exists: true,
//   revoked: false,
//   endorsements: 3,
//   raw: "0x0c000..."
// }
```

## Hook Usage

```javascript
import { useCredentialVerify } from "@/hooks/useCredentialVerify";

const { verify, result, isVerified, isRevoked, loading } = useCredentialVerify();
await verify("a1b2c3...");
```

## Verification Steps

1. Check `proofleger3.get-doc` — does hash exist?
2. Check `revocations.is-revoked` — was it revoked?
3. Check `endorsements.get-endorsement-count` — how many endorsements?

## Batch Verification

```javascript
import { batchVerify } from "@/lib/credential-verifier";

const results = await batchVerify(["hash1", "hash2", "hash3"]);
```