# ProofLedger MiniPay Integration

ProofLedger supports MiniPay — the Celo mobile wallet built into Opera Mini.

## Detection

```javascript
import { useMiniPay } from "@/hooks/useMiniPay";

const { isMiniPay, address, connect } = useMiniPay();
if (isMiniPay) console.log("Running inside MiniPay");
```

## Auto-Connect

```javascript
import { useMiniPaySession } from "@/hooks/useMiniPaySession";

useMiniPaySession((address) => {
  console.log("MiniPay connected:", address);
});
```

## MiniPay-Optimized UI

Use `<MiniPayAnchorFlow />` for a streamlined 3-step mobile experience:
1. Tap to select file → hash computed client-side
2. Add optional title → review hash
3. Anchor to Celo → see CeloScan link

## Why MiniPay?

- 100M+ potential users in Africa via Opera Mini
- Sub-cent CELO gas fees
- No wallet installation needed
- Native mobile experience