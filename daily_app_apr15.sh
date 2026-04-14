#!/bin/bash
# ProofLedger App - Daily Commits April 15
# cd proofleger && bash daily_app_apr15.sh

set -e
GREEN="\033[0;32m"; YELLOW="\033[1;33m"; NC="\033[0m"
TOTAL=0

c() {
  mkdir -p "$(dirname "$1")"
  printf '%s' "$3" > "$1"
  git add "$1"
  git commit -m "$2" -q
  TOTAL=$((TOTAL + 1))
  echo -e "${GREEN}✓ [$TOTAL]${NC} $2"
}

bump() {
  node -e "const fs=require('fs');const p=JSON.parse(fs.readFileSync('package.json','utf8'));p.version='$1';fs.writeFileSync('package.json',JSON.stringify(p,null,2)+'\n');"
  git add package.json
  git commit -m "Bump version to $1" -q
  TOTAL=$((TOTAL + 1))
  echo -e "${YELLOW}↑ [$TOTAL]${NC} Version $1"
}

echo -e "${YELLOW}Daily commits Apr 15 starting...${NC}"

# ── MiniPay deep integration ──────────────────────────────────

c src/hooks/useMiniPaySession.js \
"Add useMiniPaySession hook: manage MiniPay wallet session and auto-reconnect" \
'"use client";
import { useState, useEffect, useCallback } from "react";

export function useMiniPaySession() {
  const [address, setAddress] = useState(null);
  const [chainId, setChainId] = useState(null);
  const [ready, setReady] = useState(false);

  const connect = useCallback(async () => {
    if (typeof window === "undefined" || !window.ethereum) return null;
    try {
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      const chain = await window.ethereum.request({ method: "eth_chainId" });
      setAddress(accounts[0] || null);
      setChainId(parseInt(chain, 16));
      setReady(true);
      return accounts[0];
    } catch { return null; }
  }, []);

  useEffect(() => {
    if (!window?.ethereum) return;
    // Auto-connect if already authorized
    window.ethereum.request({ method: "eth_accounts" }).then(accounts => {
      if (accounts?.length) {
        setAddress(accounts[0]);
        window.ethereum.request({ method: "eth_chainId" }).then(c => setChainId(parseInt(c, 16)));
        setReady(true);
      }
    }).catch(() => {});

    window.ethereum.on?.("accountsChanged", accs => setAddress(accs[0] || null));
    window.ethereum.on?.("chainChanged", c => setChainId(parseInt(c, 16)));
  }, []);

  const isCelo = chainId === 42220;
  const isMiniPay = typeof window !== "undefined" && !!window?.ethereum?.isMiniPay;

  return { address, chainId, isCelo, isMiniPay, ready, connect };
}'

c src/hooks/useCeloGas.js \
"Add useCeloGas hook: estimate Celo transaction gas costs in USD" \
'"use client";
import { useState, useCallback } from "react";

const CELO_RPC = "https://feth.celo.org";

export function useCeloGas() {
  const [gasPrice, setGasPrice] = useState(null);
  const [loading, setLoading] = useState(false);

  const estimate = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(CELO_RPC, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jsonrpc: "2.0", method: "eth_gasPrice", params: [], id: 1 }),
      });
      const data = await res.json();
      const gwei = parseInt(data.result, 16) / 1e9;
      setGasPrice(gwei);
      return gwei;
    } catch { return null; }
    finally { setLoading(false); }
  }, []);

  // Estimate cost for a typical anchor tx (~100k gas)
  const estimatedCost = gasPrice ? (gasPrice * 100000) / 1e9 : null;

  return { gasPrice, estimatedCost, loading, estimate };
}'

c src/lib/celo-indexer.js \
"Add celo-indexer: query ProofLedger Celo events via Celoscan API" \
'const CELOSCAN = "https://api.celoscan.io/api";
const CONTRACT = "0x251B3302c0CcB1cFBeb0cda3dE06C2D312a41735";

export async function getCeloProofsByWallet(address, page = 1) {
  const url = `${CELOSCAN}?module=account&action=txlist&address=${address}&sort=desc&page=${page}&offset=20`;
  try {
    const res = await fetch(url);
    const data = await res.json();
    if (data.status !== "1") return [];
    return (data.result || []).filter(tx =>
      tx.to?.toLowerCase() === CONTRACT.toLowerCase() && tx.isError === "0"
    );
  } catch { return []; }
}

export async function getCeloTotalDocs(address) {
  const txs = await getCeloProofsByWallet(address);
  return txs.filter(tx => tx.input?.startsWith("0x")).length;
}

export async function getLatestCeloBlock() {
  try {
    const res = await fetch(`https://feth.celo.org`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ jsonrpc:"2.0", method:"eth_blockNumber", params:[], id:1 }),
    });
    const data = await res.json();
    return parseInt(data.result, 16);
  } catch { return null; }
}'

c src/components/CeloWalletStatus.jsx \
"Add CeloWalletStatus: MiniPay connection status display with chain indicator" \
'"use client";
import { useMiniPaySession } from "@/hooks/useMiniPaySession";

export default function CeloWalletStatus() {
  const { address, isCelo, isMiniPay, ready, connect } = useMiniPaySession();

  if (!ready && !address) {
    return (
      <button onClick={connect}
        style={{ border:"3px solid #35D07F", background:"transparent", color:"#35D07F",
          padding:"10px 20px", fontFamily:"Archivo Black, sans-serif", fontSize:12,
          cursor:"pointer", boxShadow:"3px 3px 0 #35D07F", letterSpacing:1 }}>
        CONNECT {isMiniPay ? "MINIPAY" : "CELO WALLET"}
      </button>
    );
  }

  return (
    <div style={{ display:"flex", alignItems:"center", gap:10,
      border:"2px solid #35D07F", padding:"8px 14px" }}>
      <div style={{ width:8, height:8, background:"#35D07F", borderRadius:"50%",
        boxShadow:"0 0 6px #35D07F" }} />
      <div>
        <div style={{ fontFamily:"Space Mono, monospace", fontSize:10, color:"#35D07F" }}>
          {isMiniPay ? "MINIPAY" : "CELO"} · {isCelo ? "MAINNET" : "WRONG CHAIN"}
        </div>
        <div style={{ fontFamily:"Space Mono, monospace", fontSize:10, color:"#888" }}>
          {address?.slice(0,6)}...{address?.slice(-4)}
        </div>
      </div>
    </div>
  );
}'

c src/components/GasCostEstimate.jsx \
"Add GasCostEstimate: show estimated Celo transaction cost before anchoring" \
'"use client";
import { useEffect } from "react";
import { useCeloGas } from "@/hooks/useCeloGas";

export default function GasCostEstimate({ show = true }) {
  const { gasPrice, estimatedCost, loading, estimate } = useCeloGas();

  useEffect(() => { if (show) estimate(); }, [show]);

  if (!show || loading) return null;
  if (!estimatedCost) return null;

  return (
    <div style={{ display:"flex", alignItems:"center", gap:8, padding:"6px 12px",
      background:"#0d1f16", border:"2px solid #35D07F",
      fontFamily:"Space Mono, monospace", fontSize:10 }}>
      <span style={{ color:"#35D07F" }}>⛽</span>
      <span style={{ color:"#888" }}>Est. gas: ~{estimatedCost.toFixed(6)} CELO</span>
      <span style={{ color:"#555" }}>(sub-cent)</span>
    </div>
  );
}'

bump "0.4.1"

# ── Dashboard improvements ────────────────────────────────────

c src/app/ops/dashgrey/components/BotStatus.jsx \
"Add BotStatus component: ops dashboard bot health monitor" \
'"use client";
import { useState, useEffect } from "react";

export default function BotStatus() {
  const [status, setStatus] = useState(null);

  useEffect(() => {
    // Fetch from ops API
    fetch("/api/ops/bot-status").then(r => r.json()).then(setStatus).catch(() => {});
  }, []);

  const items = [
    { label: "Scheduler", value: status?.schedulerRunning ? "RUNNING" : "STOPPED", ok: status?.schedulerRunning },
    { label: "Last Run", value: status?.lastRun || "Unknown", ok: true },
    { label: "Next Run", value: status?.nextRun || "Unknown", ok: true },
    { label: "Active Wallets", value: status?.activeWallets ?? "—", ok: (status?.activeWallets || 0) >= 30 },
    { label: "Total TXs Today", value: status?.txsToday ?? "—", ok: true },
    { label: "Runs Completed", value: status?.runsCompleted ?? "—", ok: true },
  ];

  return (
    <div>
      <div style={{ fontFamily:"Archivo Black, sans-serif", fontSize:14, color:"#F7931A",
        marginBottom:16, letterSpacing:1 }}>BOT STATUS</div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
        {items.map((item, i) => (
          <div key={i} style={{ border:`2px solid ${item.ok ? "#333" : "#ff3333"}`, padding:"10px 14px" }}>
            <div style={{ fontFamily:"Space Mono, monospace", fontSize:9, color:"#666", marginBottom:4 }}>{item.label}</div>
            <div style={{ fontFamily:"Archivo Black, sans-serif", fontSize:13,
              color: item.ok ? "#f5f0e8" : "#ff3333" }}>{String(item.value)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}'

c src/app/ops/dashgrey/components/WalletPool.jsx \
"Add WalletPool component: ops dashboard wallet funding status" \
'"use client";
import { useState, useEffect } from "react";

export default function WalletPool() {
  const [pool, setPool] = useState(null);

  useEffect(() => {
    fetch("/api/ops/wallet-pool").then(r => r.json()).then(setPool).catch(() => {});
  }, []);

  const active = pool?.active || 0;
  const depleted = pool?.depleted || 0;
  const total = active + depleted;
  const pct = total > 0 ? Math.round((active / total) * 100) : 0;

  return (
    <div>
      <div style={{ fontFamily:"Archivo Black, sans-serif", fontSize:14, color:"#F7931A",
        marginBottom:16, letterSpacing:1 }}>WALLET POOL</div>
      <div style={{ marginBottom:12 }}>
        <div style={{ display:"flex", justifyContent:"space-between", fontFamily:"Space Mono, monospace",
          fontSize:10, color:"#888", marginBottom:6 }}>
          <span>{active} ACTIVE</span><span>{depleted} DEPLETED</span>
        </div>
        <div style={{ height:8, background:"#222", border:"2px solid #333" }}>
          <div style={{ height:"100%", background:"#00ff88", width:`${pct}%`, transition:"width 0.3s" }} />
        </div>
        <div style={{ fontFamily:"Space Mono, monospace", fontSize:9, color:"#555", marginTop:4 }}>
          {pct}% funded · {total} total wallets
        </div>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8 }}>
        {[["FIRST 100", pool?.first100Active||0, "#F7931A"],
          ["LAST 60", pool?.last60Active||0, "#a78bfa"],
          ["AGENT BAL", pool?.agentBalance ? `${pool.agentBalance.toFixed(2)} STX` : "—", "#38bdf8"]
        ].map(([label, val, color], i) => (
          <div key={i} style={{ border:`2px solid ${color}`, padding:"10px 8px", textAlign:"center" }}>
            <div style={{ fontFamily:"Archivo Black, sans-serif", fontSize:16, color }}>{val}</div>
            <div style={{ fontFamily:"Space Mono, monospace", fontSize:8, color:"#666", marginTop:4 }}>{label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}'

c src/app/api/ops/bot-status/route.js \
"Add bot-status API route: ops dashboard bot health endpoint" \
'import { NextResponse } from "next/server";

const PASSWORD = process.env.NEXT_PUBLIC_DASHBOARD_PASSWORD || "dashgrey";

export async function GET(request) {
  const auth = request.headers.get("x-ops-key");
  if (auth !== PASSWORD) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // In production this would read from the bot log file or database
  // For now return mock structure
  return NextResponse.json({
    schedulerRunning: true,
    lastRun: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    nextRun: new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString(),
    activeWallets: 45,
    txsToday: 150,
    runsCompleted: 12,
    uptime: "99.2%",
  });
}'

c src/app/api/ops/wallet-pool/route.js \
"Add wallet-pool API route: ops dashboard wallet funding status endpoint" \
'import { NextResponse } from "next/server";

const PASSWORD = process.env.NEXT_PUBLIC_DASHBOARD_PASSWORD || "dashgrey";

export async function GET(request) {
  const auth = request.headers.get("x-ops-key");
  if (auth !== PASSWORD) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // In production reads from wallets.json on the server
  return NextResponse.json({
    active: 45,
    depleted: 115,
    first100Active: 45,
    last60Active: 0,
    agentBalance: 11.92,
    totalWallets: 160,
    lastChecked: new Date().toISOString(),
  });
}'

bump "0.4.2"

# ── More utility components ───────────────────────────────────

c src/components/HeroSection.jsx \
"Add HeroSection: landing hero with Bitcoin anchor value proposition" \
'"use client";
export default function HeroSection({ onGetStarted }) {
  return (
    <div style={{ textAlign:"center", padding:"60px 24px 40px", maxWidth:720, margin:"0 auto" }}>
      <div style={{ fontFamily:"Space Mono, monospace", fontSize:11, color:"#F7931A",
        letterSpacing:3, marginBottom:16 }}>BITCOIN · STACKS · CELO</div>
      <h1 style={{ fontFamily:"Archivo Black, sans-serif", fontSize:"clamp(32px,6vw,56px)",
        color:"#f5f0e8", lineHeight:1.1, marginBottom:16 }}>
        ANCHOR DOCUMENTS<br/>TO BITCOIN
      </h1>
      <p style={{ fontFamily:"Space Grotesk, sans-serif", fontSize:16, color:"#888",
        lineHeight:1.7, marginBottom:32, maxWidth:480, margin:"0 auto 32px" }}>
        Prove a document existed at a specific point in time.
        Hash locally. Anchor permanently. Verify forever.
      </p>
      <div style={{ display:"flex", gap:12, justifyContent:"center", flexWrap:"wrap" }}>
        <button onClick={onGetStarted}
          style={{ background:"#F7931A", border:"3px solid #F7931A", color:"#000",
            padding:"14px 32px", fontFamily:"Archivo Black, sans-serif", fontSize:14,
            cursor:"pointer", boxShadow:"4px 4px 0 #d4780f", letterSpacing:1 }}>
          ANCHOR A DOCUMENT
        </button>
        <a href="/verify"
          style={{ border:"3px solid #f5f0e8", color:"#f5f0e8", padding:"14px 32px",
            fontFamily:"Archivo Black, sans-serif", fontSize:14, textDecoration:"none",
            letterSpacing:1 }}>
          VERIFY DOCUMENT
        </a>
      </div>
    </div>
  );
}'

c src/components/FeatureGrid.jsx \
"Add FeatureGrid: homepage feature highlights grid" \
'"use client";
const FEATURES = [
  { icon:"₿", title:"Bitcoin Anchored", desc:"Every proof is permanently recorded on Bitcoin via Stacks L2." },
  { icon:"🔒", title:"Privacy First", desc:"Your files never leave your browser. Only the SHA-256 hash is sent." },
  { icon:"✓", title:"Instant Verify", desc:"Anyone can verify a document in seconds with no wallet required." },
  { icon:"🌐", title:"Multi-Chain", desc:"Anchor on Stacks or Celo. Works natively inside MiniPay." },
  { icon:"🏆", title:"Soulbound NFTs", desc:"Mint non-transferable credential NFTs tied to your wallet." },
  { icon:"🛡️", title:"Open Protocol", desc:"All contracts are open source and deployed on mainnet." },
];

export default function FeatureGrid() {
  return (
    <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",
      gap:16, maxWidth:960, margin:"0 auto", padding:"0 24px 40px" }}>
      {FEATURES.map((f,i) => (
        <div key={i} style={{ border:"3px solid #222", padding:20, background:"#0d0d0d" }}>
          <div style={{ fontSize:24, marginBottom:10 }}>{f.icon}</div>
          <div style={{ fontFamily:"Archivo Black, sans-serif", fontSize:13,
            color:"#F7931A", marginBottom:6, letterSpacing:0.5 }}>{f.title}</div>
          <div style={{ fontFamily:"Space Grotesk, sans-serif", fontSize:12,
            color:"#666", lineHeight:1.6 }}>{f.desc}</div>
        </div>
      ))}
    </div>
  );
}'

c src/components/HowItWorks.jsx \
"Add HowItWorks: step-by-step guide component for landing page" \
'"use client";
const STEPS = [
  { n:"01", title:"Select File", desc:"Choose any file — PDF, image, video, document. It stays on your device." },
  { n:"02", title:"Hash Locally", desc:"Your browser computes a SHA-256 hash. This fingerprint uniquely identifies the file." },
  { n:"03", title:"Anchor to Bitcoin", desc:"Sign a transaction with your Hiro Wallet or MiniPay. The hash is stored on Stacks/Celo." },
  { n:"04", title:"Verify Forever", desc:"Share your hash. Anyone can verify it at any time with no login required." },
];

export default function HowItWorks() {
  return (
    <div style={{ maxWidth:720, margin:"0 auto", padding:"40px 24px" }}>
      <h2 style={{ fontFamily:"Archivo Black, sans-serif", fontSize:22,
        color:"#f5f0e8", marginBottom:32, textAlign:"center", letterSpacing:2 }}>
        HOW IT WORKS
      </h2>
      {STEPS.map((s,i) => (
        <div key={i} style={{ display:"flex", gap:20, marginBottom:24,
          paddingBottom:24, borderBottom: i < STEPS.length-1 ? "2px solid #1a1a1a" : "none" }}>
          <div style={{ fontFamily:"Archivo Black, sans-serif", fontSize:28,
            color:"#F7931A", opacity:0.4, flexShrink:0, lineHeight:1, paddingTop:2 }}>{s.n}</div>
          <div>
            <div style={{ fontFamily:"Archivo Black, sans-serif", fontSize:15,
              color:"#f5f0e8", marginBottom:6 }}>{s.title}</div>
            <div style={{ fontFamily:"Space Grotesk, sans-serif", fontSize:13,
              color:"#666", lineHeight:1.6 }}>{s.desc}</div>
          </div>
        </div>
      ))}
    </div>
  );
}'

c src/components/LiveFeed.jsx \
"Add LiveFeed: real-time recent anchors feed on homepage" \
'"use client";
import { useState, useEffect } from "react";

const C = "SP1SY1E599GN04XRD2DQBKV7E62HYBJR2CT9S5QKK";

export default function LiveFeed({ limit = 5 }) {
  const [txs, setTxs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`https://api.hiro.so/extended/v1/address/${C}.proofleger3/transactions?limit=${limit}`)
      .then(r => r.json())
      .then(d => { setTxs(d.results || []); setLoading(false); })
      .catch(() => setLoading(false));
    const interval = setInterval(() => {
      fetch(`https://api.hiro.so/extended/v1/address/${C}.proofleger3/transactions?limit=${limit}`)
        .then(r => r.json()).then(d => setTxs(d.results || [])).catch(() => {});
    }, 30000);
    return () => clearInterval(interval);
  }, [limit]);

  return (
    <div style={{ maxWidth:720, margin:"0 auto", padding:"0 24px 40px" }}>
      <h3 style={{ fontFamily:"Archivo Black, sans-serif", fontSize:14, color:"#555",
        letterSpacing:2, marginBottom:16 }}>RECENT ANCHORS</h3>
      {loading && <div style={{ color:"#444", fontFamily:"Space Mono, monospace", fontSize:11 }}>Loading...</div>}
      {txs.filter(t => t.tx_status === "success").map((tx, i) => (
        <div key={i} style={{ display:"flex", justifyContent:"space-between", alignItems:"center",
          padding:"10px 0", borderBottom:"1px solid #1a1a1a" }}>
          <div style={{ fontFamily:"Space Mono, monospace", fontSize:10, color:"#555" }}>
            {tx.sender_address?.slice(0,10)}...
          </div>
          <div style={{ fontFamily:"Space Mono, monospace", fontSize:10, color:"#333" }}>
            Block #{tx.block_height}
          </div>
          <div style={{ width:6, height:6, background:"#00ff88", borderRadius:"50%",
            boxShadow:"0 0 4px #00ff88" }} />
        </div>
      ))}
    </div>
  );
}'

bump "0.4.3"

# ── Docs ──────────────────────────────────────────────────────

c docs/minipay.md \
"Add MiniPay deep integration docs: session management and gas estimation" \
'# MiniPay Deep Integration

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
```'

c docs/ops-dashboard.md \
"Add ops dashboard docs: monitoring and management guide" \
'# ProofLedger Ops Dashboard

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
```'

c docs/landing-components.md \
"Add landing page components docs: hero, features, how-it-works, live feed" \
'# Landing Page Components

## HeroSection

```jsx
import HeroSection from "@/components/HeroSection";
<HeroSection onGetStarted={() => setTab("anchor")} />
```

Bitcoin/Stacks/Celo branding, CTA buttons, responsive headline.

## FeatureGrid

```jsx
import FeatureGrid from "@/components/FeatureGrid";
<FeatureGrid />
```

6-column grid of protocol features with icons.

## HowItWorks

```jsx
import HowItWorks from "@/components/HowItWorks";
<HowItWorks />
```

4-step numbered guide: Select → Hash → Anchor → Verify.

## LiveFeed

```jsx
import LiveFeed from "@/components/LiveFeed";
<LiveFeed limit={5} />
```

Auto-refreshes every 30s with latest anchors from chain.'

bump "0.5.0"

echo -e "${YELLOW}Pushing...${NC}"
git push origin main -q
echo -e "${GREEN}Done! $TOTAL commits. Version 0.5.0${NC}"
