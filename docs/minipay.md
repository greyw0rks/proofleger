# MiniPay Deep Integration

## Session Management

```javascript
import { useMiniPaySession } from "@/hooks/useMiniPaySession";

const { address, isCelo, isMiniPay, ready, connect } = useMiniPaySession();
```

Auto-reconnects on page load if wallet was previously connected.
Listens for account and chain change events automatically.

## Gas Estimation

```javascript
import { useCeloGas } from "@/hooks/useCeloGas";

const { gasPrice, estimatedCost, estimate } = useCeloGas();
await estimate();
// estimatedCost ≈ 0.00003 CELO (sub-cent)
```

## Chain Detection

```javascript
const { chainId, isCelo } = useMiniPaySession();
// chainId === 42220 means Celo mainnet
```

## MiniPay Test Environment

1. Open MiniPay app
2. Go to Settings → Developer
3. Enable Developer Mode
4. Load URL: `https://proofleger.vercel.app`

## Celo Indexer

```javascript
import { getCeloProofsByWallet, getCeloTotalDocs } from "@/lib/celo-indexer";

const txs = await getCeloProofsByWallet("0x...");
const count = await getCeloTotalDocs("0x...");
```