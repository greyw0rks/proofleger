# ProofLedger Achievement NFTs

Soulbound NFTs on Stacks rewarding protocol milestones.

## Mint an Achievement NFT

```javascript
import { useMintNFT } from "@/hooks/useMintNFT";

const { mint, loading, txId } = useMintNFT();
await mint("sha256hashhere");
```

## MintButton Component

```jsx
import MintButton from "@/components/MintButton";

<MintButton hash="a1b2c3..." onMinted={() => console.log("minted!")} />
```

## Achievement Types

Defined in `contracts/achievements.clar`:

| Milestone | Trigger |
|---|---|
| First Anchor | Anchor first document |
| Power User | Anchor 10 documents |
| Century Mark | Anchor 100 documents |
| Attester | Attest 5 documents |
| Verified Issuer | Whitelist approved |

## Soulbound

Achievement NFTs are non-transferable. They represent the wallet owner's actual activity and cannot be sold or transferred.