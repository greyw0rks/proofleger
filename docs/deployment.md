# ProofLedger Deployment Guide

## Vercel (Frontend)

1. Import `greyw0rks/proofleger` at vercel.com/new
2. No extra config needed — Next.js auto-detected
3. Set environment variables:
   - `NEXT_PUBLIC_DASHBOARD_PASSWORD` — ops dashboard password

## AWS (Bot Infrastructure)

The bot infrastructure runs on AWS EC2 Ubuntu.

### Setup
```bash
nvm use 22
cd ~/proofleger/bots
export AGENT_MNEMONIC="your mnemonic"
tmux new-session -d -s proofleger-bots "node scheduler.js"
```

### Monitoring
```bash
tmux attach -t proofleger-bots
tail -f ~/proofleger/bots/scheduler.log
```

## Contracts

Deploy via Hiro Platform (platform.hiro.so):
1. Connect wallet
2. Import proofleger-contracts repo
3. Deploy in order: proofleger3 → credentials → achievements
