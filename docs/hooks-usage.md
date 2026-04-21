# ProofLedger Hooks Usage Guide

## Anchor a Document

```javascript
import { useAnchor }   from "@/hooks/useAnchor";
import { useHash }     from "@/hooks/useHash";

const { hashFile, hash, hashing } = useHash();
const { anchor, loading, txId }   = useAnchor();

async function handleFile(file) {
  await hashFile(file);
}

async function handleAnchor() {
  await anchor(hash, title, docType);
}
```

## Verify a Document

```javascript
import { useVerify } from "@/hooks/useVerify";

const { verify, result, loading } = useVerify();
await verify("sha256hashhere");
// result: { exists, owner, title, docType, blockHeight }
```

## Wallet Data

```javascript
import { useReputation }    from "@/hooks/useReputation";
import { useProofHistory }  from "@/hooks/useProofHistory";
import { useRecentActivity} from "@/hooks/useRecentActivity";

const { stats, tier }  = useReputation(address);
const { history, add } = useProofHistory();
const { activity }     = useRecentActivity(20);
```

## Celo Chain

```javascript
import { useCeloAnchor } from "@/hooks/useCeloAnchor";
import { useCeloVerify } from "@/hooks/useCeloVerify";
import { useMiniPay }    from "@/hooks/useMiniPay";

const { anchor }   = useCeloAnchor();
const { verify }   = useCeloVerify();
const { isMiniPay} = useMiniPay();
```

## Multi-Chain

```javascript
import { verifyMultiChain } from "@/lib/multi-chain-verifier";

const { stacks, celo, isMultiChain } = await verifyMultiChain(hash);
```