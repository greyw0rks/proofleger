# ProofLedger × Talent Protocol

ProofLedger displays Talent Protocol builder scores on wallet profiles.

## Builder Score

Talent Protocol aggregates Web3 credentials into a single score (0-100):
- **Activity score** — on-chain transaction history
- **Identity score** — verified credentials and accounts
- **Skills score** — technical contributions

## Display Component

```jsx
import TalentBadge from "@/components/TalentBadge";

<TalentBadge address="SP1SY1..." />       // full badge
<TalentBadge address="SP1SY1..." compact /> // score only
```

## Hook

```javascript
import { useTalentScore } from "@/hooks/useTalentScore";

const { score, loading } = useTalentScore(address);
// score: { score, activity, identity, skills, verified, credentials }
```

## Score Tiers

| Score | Tier |
|---|---|
| 80+ | EXCEPTIONAL |
| 60-79 | ADVANCED |
| 40-59 | ESTABLISHED |
| 20-39 | EMERGING |
| 0-19 | NEWCOMER |

## Env Var

```
NEXT_PUBLIC_TALENT_API_KEY=your_key_here
```

Get a key at https://docs.talentprotocol.com