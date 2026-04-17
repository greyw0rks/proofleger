#!/bin/bash
# ProofLedger App - Daily Commits April 18
# cd proofleger && bash daily_app_apr18.sh

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

echo -e "${YELLOW}Daily commits Apr 18 starting...${NC}"

# ── Analytics and reporting ───────────────────────────────────

c src/lib/analytics-collector.js \
"Add analytics-collector: aggregate on-chain protocol analytics" \
'import { StacksAPI } from "./stacks-api";
const C = "SP1SY1E599GN04XRD2DQBKV7E62HYBJR2CT9S5QKK";

export async function collectProtocolStats() {
  const contracts = ["proofleger3", "credentials", "achievements", "endorsements"];
  const results = await Promise.allSettled(
    contracts.map(n => StacksAPI.getContractTransactions(C, n, 50))
  );
  const stats = {};
  results.forEach((r, i) => {
    const name = contracts[i];
    if (r.status === "fulfilled") {
      const txs = r.value.results || [];
      const success = txs.filter(t => t.tx_status === "success");
      stats[name] = {
        total: r.value.total || 0,
        recent: txs.length,
        successRate: txs.length > 0 ? Math.round((success.length / txs.length) * 100) : 0,
        functions: success.reduce((acc, t) => {
          const fn = t.contract_call?.function_name || "unknown";
          acc[fn] = (acc[fn] || 0) + 1;
          return acc;
        }, {}),
      };
    }
  });
  return stats;
}

export async function getActiveWallets(days = 7) {
  const data = await StacksAPI.getContractTransactions(C, "proofleger3", 200);
  const cutoff = Date.now() - days * 86400000;
  const wallets = new Set(
    (data.results || [])
      .filter(t => t.tx_status === "success" && new Date(t.burn_block_time_iso).getTime() > cutoff)
      .map(t => t.sender_address)
  );
  return { count: wallets.size, wallets: [...wallets] };
}'

c src/lib/leaderboard-builder.js \
"Add leaderboard-builder: compute top wallets by proof activity" \
'import { StacksAPI } from "./stacks-api";
const C = "SP1SY1E599GN04XRD2DQBKV7E62HYBJR2CT9S5QKK";

export async function buildLeaderboard(limit = 20) {
  const data = await StacksAPI.getContractTransactions(C, "proofleger3", 200);
  const txs = (data.results || []).filter(t => t.tx_status === "success");

  const walletMap = {};
  for (const tx of txs) {
    const addr = tx.sender_address;
    if (!walletMap[addr]) walletMap[addr] = { address: addr, anchors: 0, attests: 0, mints: 0 };
    const fn = tx.contract_call?.function_name || "";
    if (fn.includes("store") || fn.includes("anchor")) walletMap[addr].anchors++;
    if (fn.includes("attest")) walletMap[addr].attests++;
    if (fn.includes("mint")) walletMap[addr].mints++;
  }

  return Object.values(walletMap)
    .map(w => ({ ...w, score: w.anchors * 10 + w.attests * 5 + w.mints * 25 }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

export function getRankLabel(rank) {
  if (rank === 1) return "🥇";
  if (rank === 2) return "🥈";
  if (rank === 3) return "🥉";
  return `#${rank}`;
}'

c src/hooks/useAnalytics.js \
"Add useAnalytics hook: fetch and cache protocol analytics data" \
'"use client";
import { useState, useEffect } from "react";
import { collectProtocolStats, getActiveWallets } from "@/lib/analytics-collector";
import { cacheWrap } from "@/lib/cache";

export function useAnalytics() {
  const [stats, setStats] = useState(null);
  const [activeWallets, setActiveWallets] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const [s, a] = await Promise.all([
          cacheWrap("analytics:stats", collectProtocolStats, 120_000),
          cacheWrap("analytics:wallets", () => getActiveWallets(7), 120_000),
        ]);
        setStats(s);
        setActiveWallets(a);
      } catch(e) { console.error(e); }
      finally { setLoading(false); }
    }
    load();
  }, []);

  return { stats, activeWallets, loading };
}'

c src/hooks/useLeaderboard.js \
"Add useLeaderboard hook: fetch ranked wallet leaderboard data" \
'"use client";
import { useState, useEffect } from "react";
import { buildLeaderboard } from "@/lib/leaderboard-builder";
import { cacheWrap } from "@/lib/cache";

export function useLeaderboard(limit = 20) {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cacheWrap(`leaderboard:${limit}`, () => buildLeaderboard(limit), 300_000)
      .then(setEntries)
      .catch(() => setEntries([]))
      .finally(() => setLoading(false));
  }, [limit]);

  return { entries, loading };
}'

c src/components/LeaderboardTable.jsx \
"Add LeaderboardTable: ranked wallet table with scores and activity" \
'"use client";
import { useLeaderboard } from "@/hooks/useLeaderboard";
import { getRankLabel } from "@/lib/leaderboard-builder";
import Spinner from "./Spinner";

export default function LeaderboardTable({ limit = 10 }) {
  const { entries, loading } = useLeaderboard(limit);

  if (loading) return <div style={{ padding:20 }}><Spinner /></div>;

  return (
    <div>
      {entries.map((e, i) => (
        <div key={e.address} style={{ display:"flex", alignItems:"center", gap:16,
          padding:"14px 0", borderBottom:"1px solid #1a1a1a" }}>
          <div style={{ fontFamily:"Archivo Black, sans-serif", fontSize:18,
            color:"#F7931A", minWidth:36, textAlign:"center" }}>
            {getRankLabel(i + 1)}
          </div>
          <div style={{ flex:1 }}>
            <a href={`/profile/${e.address}`}
              style={{ fontFamily:"Space Mono, monospace", fontSize:11,
                color:"#f5f0e8", textDecoration:"none" }}
              onMouseOver={ev => ev.target.style.color="#F7931A"}
              onMouseOut={ev => ev.target.style.color="#f5f0e8"}>
              {e.address.slice(0,10)}...{e.address.slice(-6)}
            </a>
          </div>
          <div style={{ display:"flex", gap:12, fontFamily:"Space Mono, monospace", fontSize:10 }}>
            <span style={{ color:"#F7931A" }}>{e.anchors}A</span>
            <span style={{ color:"#00ff88" }}>{e.attests}T</span>
            <span style={{ color:"#a78bfa" }}>{e.mints}N</span>
          </div>
          <div style={{ fontFamily:"Archivo Black, sans-serif", fontSize:14,
            color:"#f5f0e8", minWidth:48, textAlign:"right" }}>
            {e.score}
          </div>
        </div>
      ))}
      <div style={{ fontFamily:"Space Mono, monospace", fontSize:9, color:"#444",
        marginTop:12, textAlign:"right" }}>
        A=Anchors · T=Attests · N=NFTs · Score = A×10 + T×5 + N×25
      </div>
    </div>
  );
}'

c src/components/AnalyticsDashboard.jsx \
"Add AnalyticsDashboard: protocol-wide stats overview component" \
'"use client";
import { useAnalytics } from "@/hooks/useAnalytics";
import StatCard from "./StatCard";
import Spinner from "./Spinner";

export default function AnalyticsDashboard() {
  const { stats, activeWallets, loading } = useAnalytics();

  if (loading) return <div style={{ padding:20 }}><Spinner /></div>;

  const totalTxs = stats ? Object.values(stats).reduce((s, c) => s + (c.total || 0), 0) : 0;
  const totalRecent = stats ? Object.values(stats).reduce((s, c) => s + (c.recent || 0), 0) : 0;

  return (
    <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))", gap:16 }}>
      <StatCard label="TOTAL TRANSACTIONS" value={totalTxs.toLocaleString()} color="#F7931A" sub="all time" />
      <StatCard label="RECENT TXS" value={totalRecent} color="#00ff88" sub="last 50 per contract" />
      <StatCard label="ACTIVE WALLETS" value={activeWallets?.count || 0} color="#38bdf8" sub="last 7 days" />
      <StatCard label="CONTRACTS" value={stats ? Object.keys(stats).length : 0} color="#a78bfa" sub="on mainnet" />
    </div>
  );
}'

c src/app/analytics/page.js \
"Add analytics page: full protocol analytics and activity dashboard" \
'"use client";
import AnalyticsDashboard from "@/components/AnalyticsDashboard";
import LeaderboardTable from "@/components/LeaderboardTable";

export default function AnalyticsPage() {
  return (
    <div style={{ maxWidth:960, margin:"0 auto", padding:"40px 24px",
      fontFamily:"Space Grotesk, sans-serif", color:"#f5f0e8",
      minHeight:"100vh", background:"#0a0a0a" }}>
      <h1 style={{ fontFamily:"Archivo Black, sans-serif", fontSize:28, marginBottom:8 }}>ANALYTICS</h1>
      <p style={{ color:"#888", marginBottom:32, fontSize:13 }}>
        Live ProofLedger protocol statistics from Stacks mainnet
      </p>
      <section style={{ marginBottom:40 }}>
        <div style={{ fontFamily:"Archivo Black, sans-serif", fontSize:13,
          color:"#555", marginBottom:16, letterSpacing:2 }}>PROTOCOL OVERVIEW</div>
        <AnalyticsDashboard />
      </section>
      <section>
        <div style={{ fontFamily:"Archivo Black, sans-serif", fontSize:13,
          color:"#555", marginBottom:16, letterSpacing:2 }}>TOP CONTRIBUTORS</div>
        <LeaderboardTable limit={20} />
      </section>
    </div>
  );
}'

# ── SDK enhancements ──────────────────────────────────────────

c src/lib/sdk-client.js \
"Add sdk-client: isomorphic ProofLedger SDK client for browser and Node" \
'import { cacheWrap } from "./cache";

const API = "https://api.hiro.so";
const CONTRACT = "SP1SY1E599GN04XRD2DQBKV7E62HYBJR2CT9S5QKK";

async function callReadOnly(contractName, fnName, args) {
  const res = await fetch(`${API}/v2/contracts/call-read/${CONTRACT}/${contractName}/${fnName}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ sender: CONTRACT, arguments: args }),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  if (!data.okay) throw new Error("Contract call failed");
  return data.result;
}

export const ProofLedgerClient = {
  verify: (hash) =>
    cacheWrap(`verify:${hash}`,
      () => callReadOnly("proofleger3", "get-doc", ["0x0200000020" + hash]),
      300_000),

  getProfile: (address) =>
    cacheWrap(`profile:${address}`,
      () => fetch(`${API}/v2/accounts/${address}?proof=0`).then(r => r.json()),
      60_000),

  getTxCount: (address) =>
    fetch(`${API}/extended/v1/address/${address}/transactions?limit=1`)
      .then(r => r.json())
      .then(d => d.total || 0),

  getNetworkInfo: () =>
    cacheWrap("network:info",
      () => fetch(`${API}/v2/info`).then(r => r.json()),
      30_000),
};'

c src/lib/proof-validator.js \
"Add proof-validator: validate proof data before submission" \
'import { isValidSha256 } from "@/utils/crypto";

export const DOC_TYPES = ["diploma","certificate","research","art","contribution","award","other"];

export function validateProofInput({ hash, title, docType }) {
  const errors = {};

  if (!hash) {
    errors.hash = "Hash is required";
  } else if (!isValidSha256(hash)) {
    errors.hash = "Must be a valid SHA-256 hash (64 hex chars)";
  }

  if (!title?.trim()) {
    errors.title = "Title is required";
  } else if (title.trim().length > 100) {
    errors.title = "Title must be 100 characters or less";
  } else if (!/^[\x00-\x7F]*$/.test(title)) {
    errors.title = "Title must be ASCII characters only";
  }

  if (!docType) {
    errors.docType = "Document type is required";
  } else if (!DOC_TYPES.includes(docType)) {
    errors.docType = `Must be one of: ${DOC_TYPES.join(", ")}`;
  }

  return { valid: Object.keys(errors).length === 0, errors };
}

export function sanitizeTitle(title) {
  return title?.trim().replace(/[^\x00-\x7F]/g, "").slice(0, 100) || "";
}

export function normalizeHash(hash) {
  return hash?.replace(/^0x/i, "").toLowerCase() || "";
}'

c src/utils/number.js \
"Add number utils: formatting helpers for blockchain numeric values" \
'export const fmt = {
  compact: (n) => {
    if (n >= 1_000_000) return `${(n/1_000_000).toFixed(1)}M`;
    if (n >= 1_000) return `${(n/1_000).toFixed(1)}K`;
    return String(n);
  },
  percent: (n, total) => total > 0 ? `${Math.round((n/total)*100)}%` : "0%",
  pad: (n, digits = 2) => String(n).padStart(digits, "0"),
  range: (n, min, max) => Math.min(Math.max(n, min), max),
};

export function microToStx(micro) {
  return Number(micro) / 1_000_000;
}

export function stxToMicro(stx) {
  return Math.floor(Number(stx) * 1_000_000);
}

export function hexToDecimal(hex) {
  return parseInt(hex.replace("0x", ""), 16);
}'

c src/utils/string.js \
"Add string utils: text manipulation helpers for UI display" \
'export function capitalize(str) {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

export function titleCase(str) {
  return str?.split(" ").map(capitalize).join(" ") || "";
}

export function ellipsis(str, max = 30) {
  if (!str || str.length <= max) return str || "";
  return str.slice(0, max - 3) + "...";
}

export function hexPreview(hex, chars = 8) {
  const clean = hex?.replace("0x","") || "";
  if (clean.length <= chars * 2) return clean;
  return `${clean.slice(0, chars)}...${clean.slice(-chars)}`;
}

export function countWords(str) {
  return str?.trim().split(/\s+/).filter(Boolean).length || 0;
}

export function stripHtml(html) {
  return html?.replace(/<[^>]*>/g, "") || "";
}'

c src/utils/address.js \
"Add address utils: Stacks and Celo address helpers and validators" \
'export function isStacksAddress(addr) {
  return typeof addr === "string" &&
    (addr.startsWith("SP") || addr.startsWith("ST")) &&
    addr.length >= 30 && addr.length <= 52;
}

export function isCeloAddress(addr) {
  return typeof addr === "string" && /^0x[0-9a-fA-F]{40}$/.test(addr);
}

export function shortenStacksAddress(addr, chars = 6) {
  if (!isStacksAddress(addr)) return addr || "";
  return `${addr.slice(0, chars)}...${addr.slice(-4)}`;
}

export function shortenCeloAddress(addr, chars = 6) {
  if (!isCeloAddress(addr)) return addr || "";
  return `${addr.slice(0, chars)}...${addr.slice(-4)}`;
}

export function shortenAddress(addr, chars = 6) {
  if (isStacksAddress(addr)) return shortenStacksAddress(addr, chars);
  if (isCeloAddress(addr)) return shortenCeloAddress(addr, chars);
  return addr?.slice(0, chars) + "..." || "";
}

export function getAddressType(addr) {
  if (isStacksAddress(addr)) return "stacks";
  if (isCeloAddress(addr)) return "celo";
  return "unknown";
}'

# ── More API routes ───────────────────────────────────────────

c src/app/api/leaderboard/route.js \
"Add leaderboard API route: GET top contributors by proof activity" \
'import { NextResponse } from "next/server";
const C = "SP1SY1E599GN04XRD2DQBKV7E62HYBJR2CT9S5QKK";
export async function GET(request) {
  const limit = Math.min(parseInt(new URL(request.url).searchParams.get("limit")||"20"), 50);
  try {
    const res = await fetch(`https://api.hiro.so/extended/v1/address/${C}.proofleger3/transactions?limit=200`);
    const data = await res.json();
    const walletMap = {};
    for (const tx of (data.results||[]).filter(t=>t.tx_status==="success")) {
      const addr = tx.sender_address;
      if (!walletMap[addr]) walletMap[addr] = { address:addr, anchors:0, attests:0, mints:0 };
      const fn = tx.contract_call?.function_name||"";
      if (fn.includes("store")||fn.includes("anchor")) walletMap[addr].anchors++;
      if (fn.includes("attest")) walletMap[addr].attests++;
      if (fn.includes("mint")) walletMap[addr].mints++;
    }
    const entries = Object.values(walletMap)
      .map(w=>({...w, score:w.anchors*10+w.attests*5+w.mints*25}))
      .sort((a,b)=>b.score-a.score).slice(0,limit);
    return NextResponse.json({ entries, total:entries.length },
      { headers:{"Cache-Control":"s-maxage=300"} });
  } catch(e) { return NextResponse.json({ error:e.message },{ status:500 }); }
}'

c src/app/api/analytics/route.js \
"Add analytics API route: GET protocol-wide activity metrics" \
'import { NextResponse } from "next/server";
const C = "SP1SY1E599GN04XRD2DQBKV7E62HYBJR2CT9S5QKK";
const CONTRACTS = ["proofleger3","credentials","achievements"];
export async function GET() {
  try {
    const results = await Promise.allSettled(
      CONTRACTS.map(n => fetch(`https://api.hiro.so/extended/v1/address/${C}.${n}/transactions?limit=50`).then(r=>r.json()))
    );
    const analytics = {};
    results.forEach((r,i) => {
      const name = CONTRACTS[i];
      if (r.status==="fulfilled") {
        const txs = r.value.results||[];
        const ok = txs.filter(t=>t.tx_status==="success");
        analytics[name] = { total:r.value.total||0, recent:txs.length, successRate: txs.length>0?Math.round(ok.length/txs.length*100):0 };
      }
    });
    const totalTxs = Object.values(analytics).reduce((s,c)=>s+(c.total||0),0);
    return NextResponse.json({ contracts:analytics, totalTransactions:totalTxs, lastUpdated:new Date().toISOString() },
      { headers:{"Cache-Control":"s-maxage=120"} });
  } catch(e) { return NextResponse.json({ error:e.message },{ status:500 }); }
}'

c src/app/api/wallet/[address]/route.js \
"Add wallet API route: GET complete wallet activity summary" \
'import { NextResponse } from "next/server";
const API = "https://api.hiro.so";
const C = "SP1SY1E599GN04XRD2DQBKV7E62HYBJR2CT9S5QKK";
export async function GET(request, { params }) {
  const { address } = params;
  if (!address?.startsWith("SP") && !address?.startsWith("ST")) {
    return NextResponse.json({ error:"Invalid Stacks address" },{ status:400 });
  }
  try {
    const [acct, txs, nfts] = await Promise.allSettled([
      fetch(`${API}/v2/accounts/${address}?proof=0`).then(r=>r.json()),
      fetch(`${API}/extended/v1/address/${address}/transactions?limit=50`).then(r=>r.json()),
      fetch(`${API}/extended/v1/tokens/nft/holdings?principal=${address}&asset_identifiers=${C}.achievements::achievement`).then(r=>r.json()),
    ]);
    const balance = acct.status==="fulfilled" ? Number(acct.value.balance||0)/1e6 : 0;
    const allTxs = txs.status==="fulfilled" ? txs.value.results||[] : [];
    const nftList = nfts.status==="fulfilled" ? nfts.value.results||[] : [];
    const anchors = allTxs.filter(t=>t.tx_status==="success"&&(t.contract_call?.function_name||"").includes("store")).length;
    const attests = allTxs.filter(t=>t.tx_status==="success"&&(t.contract_call?.function_name||"").includes("attest")).length;
    return NextResponse.json({ address, balance, anchors, attests, nfts:nftList.length, totalTxs:txs.status==="fulfilled"?txs.value.total||0:0 });
  } catch(e) { return NextResponse.json({ error:e.message },{ status:500 }); }
}'

# ── More components ───────────────────────────────────────────

c src/components/ActivityChart.jsx \
"Add ActivityChart: simple bar chart of weekly proof activity" \
'"use client";
export default function ActivityChart({ data = [] }) {
  if (!data.length) return null;
  const max = Math.max(...data.map(d => d.count), 1);
  return (
    <div>
      <div style={{ display:"flex", alignItems:"flex-end", gap:4, height:80 }}>
        {data.map((d, i) => (
          <div key={i} style={{ flex:1, display:"flex", flexDirection:"column",
            alignItems:"center", gap:4 }}>
            <div style={{ width:"100%", background:"#F7931A",
              height:`${(d.count / max) * 64}px`,
              opacity: i === data.length - 1 ? 1 : 0.5,
              minHeight: d.count > 0 ? 4 : 0,
              transition:"height 0.3s" }} />
            <div style={{ fontFamily:"Space Mono, monospace", fontSize:8,
              color:"#555", whiteSpace:"nowrap" }}>{d.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}'

c src/components/ContractActivity.jsx \
"Add ContractActivity: per-contract transaction activity summary" \
'"use client";
export default function ContractActivity({ contractName, total = 0, recent = 0, successRate = 0 }) {
  return (
    <div style={{ border:"2px solid #1a1a1a", padding:16 }}>
      <div style={{ display:"flex", justifyContent:"space-between", marginBottom:10 }}>
        <div style={{ fontFamily:"Space Mono, monospace", fontSize:11, color:"#F7931A" }}>
          {contractName}
        </div>
        <div style={{ fontFamily:"Archivo Black, sans-serif", fontSize:12,
          color:successRate>=90?"#00ff88":"#F7931A" }}>
          {successRate}%
        </div>
      </div>
      <div style={{ height:4, background:"#111", marginBottom:10 }}>
        <div style={{ height:"100%", background:"#F7931A", width:`${successRate}%` }} />
      </div>
      <div style={{ display:"flex", gap:16, fontFamily:"Space Mono, monospace", fontSize:9, color:"#555" }}>
        <span>{total.toLocaleString()} total</span>
        <span>{recent} recent</span>
      </div>
    </div>
  );
}'

c src/components/WalletConnect.jsx \
"Add WalletConnect: clean wallet connection button with state display" \
'"use client";
import { useWalletContext } from "@/context/WalletContext";
import Spinner from "./Spinner";

export default function WalletConnect({ compact = false }) {
  const { address, connecting, connectWallet, disconnectWallet, isConnected } = useWalletContext();

  if (isConnected) {
    return (
      <div style={{ display:"flex", alignItems:"center", gap:8 }}>
        <div style={{ width:7, height:7, background:"#00ff88", borderRadius:"50%",
          boxShadow:"0 0 6px #00ff88" }} />
        {!compact && (
          <span style={{ fontFamily:"Space Mono, monospace", fontSize:10, color:"#888" }}>
            {address?.slice(0,6)}...{address?.slice(-4)}
          </span>
        )}
        <button onClick={disconnectWallet}
          style={{ border:"2px solid #333", background:"transparent", color:"#555",
            padding:"4px 10px", fontFamily:"Archivo Black, sans-serif", fontSize:9,
            cursor:"pointer", letterSpacing:1 }}>
          DISCONNECT
        </button>
      </div>
    );
  }

  return (
    <button onClick={connectWallet} disabled={connecting}
      style={{ border:"3px solid #F7931A", background:"transparent", color:"#F7931A",
        padding: compact ? "6px 14px" : "10px 20px",
        fontFamily:"Archivo Black, sans-serif", fontSize: compact ? 10 : 12,
        cursor:"pointer", boxShadow:"3px 3px 0 #d4780f",
        display:"flex", alignItems:"center", gap:8, letterSpacing:1 }}>
      {connecting ? <><Spinner size={14} color="#F7931A" /> CONNECTING...</> : "CONNECT WALLET"}
    </button>
  );
}'

c src/components/ProtocolHealth.jsx \
"Add ProtocolHealth: shows protocol uptime and contract health status" \
'"use client";
import { useEffect, useState } from "react";
import Badge from "./Badge";

export default function ProtocolHealth() {
  const [health, setHealth] = useState(null);

  useEffect(() => {
    fetch("https://api.hiro.so/v2/info")
      .then(r => r.json())
      .then(d => setHealth({ ok: true, block: d.stacks_tip_height, network: "mainnet" }))
      .catch(() => setHealth({ ok: false }));
  }, []);

  return (
    <div style={{ display:"flex", alignItems:"center", gap:10,
      padding:"8px 14px", border:"2px solid #1a1a1a",
      fontFamily:"Space Mono, monospace", fontSize:10 }}>
      <Badge
        label={health === null ? "CHECKING" : health.ok ? "OPERATIONAL" : "DEGRADED"}
        variant={health === null ? "neutral" : health.ok ? "success" : "error"}
        dot
      />
      {health?.block && (
        <span style={{ color:"#555" }}>Block #{Number(health.block).toLocaleString()}</span>
      )}
      <span style={{ color:"#333" }}>Stacks Mainnet</span>
    </div>
  );
}'

c src/components/ActionMenu.jsx \
"Add ActionMenu: contextual action dropdown for proof records" \
'"use client";
import { useState, useRef, useEffect } from "react";

export default function ActionMenu({ actions = [] }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function close(e) { if (ref.current && !ref.current.contains(e.target)) setOpen(false); }
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  return (
    <div ref={ref} style={{ position:"relative", display:"inline-block" }}>
      <button onClick={() => setOpen(o => !o)}
        style={{ border:"2px solid #333", background:"transparent", color:"#888",
          padding:"6px 10px", fontFamily:"Space Mono, monospace", fontSize:12,
          cursor:"pointer", letterSpacing:2 }}>
        •••
      </button>
      {open && (
        <div style={{ position:"absolute", right:0, top:"100%", marginTop:4,
          background:"#0a0a0a", border:"3px solid #f5f0e8",
          boxShadow:"4px 4px 0 #f5f0e8", zIndex:50, minWidth:160 }}>
          {actions.map((action, i) => (
            <button key={i} onClick={() => { action.onClick(); setOpen(false); }}
              style={{ display:"block", width:"100%", background:"none",
                border:"none", borderBottom: i < actions.length-1 ? "1px solid #1a1a1a" : "none",
                color: action.danger ? "#ff3333" : "#f5f0e8",
                padding:"10px 16px", fontFamily:"Space Grotesk, sans-serif",
                fontSize:12, cursor:"pointer", textAlign:"left" }}
              onMouseOver={e => e.currentTarget.style.background="#111"}
              onMouseOut={e => e.currentTarget.style.background="none"}>
              {action.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}'

# ── Docs ──────────────────────────────────────────────────────

c docs/analytics.md \
"Add analytics docs: protocol analytics and leaderboard data guide" \
'# ProofLedger Analytics

## Analytics API

```bash
# Protocol overview
GET /api/analytics

# Top contributors
GET /api/leaderboard?limit=20

# Wallet activity
GET /api/wallet/SP1SY1...
```

## React Hooks

```javascript
import { useAnalytics } from "@/hooks/useAnalytics";
import { useLeaderboard } from "@/hooks/useLeaderboard";

const { stats, activeWallets, loading } = useAnalytics();
const { entries, loading } = useLeaderboard(20);
```

## SDK Client

```javascript
import { ProofLedgerClient } from "@/lib/sdk-client";

const proof = await ProofLedgerClient.verify("a1b2c3...");
const network = await ProofLedgerClient.getNetworkInfo();
const txCount = await ProofLedgerClient.getTxCount("SP1SY1...");
```

## Leaderboard Score Formula

```
Score = Anchors × 10 + Attestations × 5 + NFTs × 25
```'

c docs/validation.md \
"Add validation docs: proof input validation and sanitization guide" \
'# ProofLedger Input Validation

## Validate Before Anchoring

```javascript
import { validateProofInput, sanitizeTitle, normalizeHash } from "@/lib/proof-validator";

const { valid, errors } = validateProofInput({
  hash: "a1b2c3...",
  title: "My Diploma",
  docType: "diploma",
});

if (!valid) console.log(errors);
// { hash: null, title: null, docType: null } — all good
```

## Sanitize User Input

```javascript
const safeTitle = sanitizeTitle("  My Document™  ");
// "My Document"

const cleanHash = normalizeHash("0xA1B2C3...");
// "a1b2c3..." (no 0x prefix, lowercase)
```

## Address Validation

```javascript
import { isStacksAddress, isCeloAddress, shortenAddress } from "@/utils/address";

isStacksAddress("SP1SY1..."); // true
isCeloAddress("0x251B..."); // true
shortenAddress("SP1SY1E599GN04XRD2DQBKV7E62HYBJR2CT9S5QKK");
// "SP1SY1...QKK"
```'

echo -e "${YELLOW}Pushing...${NC}"
git push origin main -q
echo -e "${GREEN}Done! $TOTAL commits${NC}"
