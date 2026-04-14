# ProofLedger Ops Dashboard

Access at: `https://proofleger.vercel.app/ops/dashgrey`

Password: set via `NEXT_PUBLIC_DASHBOARD_PASSWORD` env var

## Components

### Bot Status
- Scheduler running/stopped
- Last and next run times
- Active wallet count
- Transactions today

### Wallet Pool
- Active vs depleted wallet count
- First 100 / Last 60 breakdown
- Agent wallet STX balance
- Funding progress bar

## API Endpoints

All require `x-ops-key` header:

```bash
curl -H "x-ops-key: YOUR_PASSWORD" \
  https://proofleger.vercel.app/api/ops/bot-status

curl -H "x-ops-key: YOUR_PASSWORD" \
  https://proofleger.vercel.app/api/ops/wallet-pool
```

## Bot Management (SSH)

```bash
# Check scheduler
tmux attach -t proofleger-bots

# Check logs
tail -f ~/proofleger/bots/scheduler.log

# Manual run
export AGENT_MNEMONIC="..."
node ~/proofleger/bots/agent.js
```