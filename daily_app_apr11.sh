#!/bin/bash
# ProofLedger App - Daily Commits April 11
# cd proofleger && bash daily_app_apr11.sh

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

echo -e "${YELLOW}Daily commits starting...${NC}"

# ── Multi-chain wallet abstraction ───────────────────────────

c src/lib/wallet-adapter.js \
"Add wallet-adapter: unified interface for Stacks and Celo wallets" \
'"use client";
import { getAddress, isWalletConnected, anchorDocument, verifyDocument, attestDocument } from "./wallet";
import { anchorDocumentCelo, verifyDocumentCelo, attestDocumentCelo, CELO_CONTRACT_ADDRESS } from "./wallet-celo";

export function getActiveWallet(network) {
  if (network === "celo") {
    return {
      isConnected: () => typeof window !== "undefined" && !!window.ethereum,
      getAddress: async () => {
        const accounts = await window.ethereum?.request({ method: "eth_accounts" });
        return accounts?.[0] || null;
      },
      anchor: anchorDocumentCelo,
      verify: verifyDocumentCelo,
      attest: (hash) => attestDocumentCelo(hash),
      explorer: "https://celoscan.io",
      contractAddress: CELO_CONTRACT_ADDRESS,
    };
  }
  return {
    isConnected: isWalletConnected,
    getAddress: async () => getAddress(),
    anchor: anchorDocument,
    verify: verifyDocument,
    attest: attestDocument,
    explorer: "https://explorer.hiro.so",
    contractAddress: "SP1SY1E599GN04XRD2DQBKV7E62HYBJR2CT9S5QKK",
  };
}'

c src/lib/proof-service.js \
"Add proof-service: business logic layer for proof operations" \
'import { sha256File, sha256Text, isValidSha256 } from "@/utils/crypto";

export async function prepareProof(input, title, docType) {
  if (!title?.trim()) throw new Error("Title is required");
  if (!docType) throw new Error("Document type is required");
  let hash;
  if (input instanceof File) {
    hash = await sha256File(input);
  } else if (typeof input === "string") {
    if (isValidSha256(input)) hash = input.replace("0x", "");
    else hash = await sha256Text(input);
  } else {
    throw new Error("Input must be a File or string");
  }
  return { hash, title: title.trim(), docType };
}

export function buildProofUrl(hash) {
  return `https://proofleger.vercel.app/verify?hash=${hash}`;
}

export function buildShareText(title, hash) {
  return `I just anchored "${title}" to Bitcoin via ProofLedger.\n\nVerify: ${buildProofUrl(hash)}\n\n#Bitcoin #Stacks #ProofOfExistence`;
}'

c src/lib/contract-calls.js \
"Add contract-calls: low-level Stacks read-only contract call helpers" \
'const API = "https://api.hiro.so";
const SENDER = "SP1SY1E599GN04XRD2DQBKV7E62HYBJR2CT9S5QKK";

async function readOnly(contract, fn, args) {
  const [addr, name] = contract.split(".");
  const res = await fetch(`${API}/v2/contracts/call-read/${addr}/${name}/${fn}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ sender: SENDER, arguments: args }),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  if (!data.okay) throw new Error("Contract call failed");
  return data.result;
}

export const Contracts = {
  CORE: `${SENDER}.proofleger3`,
  CREDS: `${SENDER}.credentials`,
  ACHIEVEMENTS: `${SENDER}.achievements`,
  ENDORSEMENTS: `${SENDER}.endorsements`,
  PROFILES: `${SENDER}.profiles`,
};

export const verifyHash = (hash) =>
  readOnly(Contracts.CORE, "get-doc", ["0x0200000020" + hash]);

export const getDocCount = (address) =>
  readOnly(Contracts.CORE, "get-wallet-count", ["0x05" + Buffer.from(address).toString("hex")]);

export const getProfile = (address) =>
  readOnly(Contracts.PROFILES, "get-profile", ["0x05" + Buffer.from(address).toString("hex")]);

export const getEndorsements = (hash) =>
  readOnly(Contracts.ENDORSEMENTS, "get-endorsement-count", ["0x0200000020" + hash]);'

c src/hooks/useContractCall.js \
"Add useContractCall hook: generic read-only contract call with caching" \
'"use client";
import { useState, useCallback, useRef } from "react";

export function useContractCall(callFn) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const cache = useRef(new Map());

  const call = useCallback(async (...args) => {
    const key = JSON.stringify(args);
    if (cache.current.has(key)) {
      setData(cache.current.get(key));
      return cache.current.get(key);
    }
    setLoading(true); setError(null);
    try {
      const result = await callFn(...args);
      cache.current.set(key, result);
      setData(result);
      return result;
    } catch(e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [callFn]);

  return { call, data, loading, error, clearCache: () => cache.current.clear() };
}'

c src/hooks/useMultiChain.js \
"Add useMultiChain hook: unified anchor and verify across Stacks and Celo" \
'"use client";
import { useState, useCallback } from "react";
import { getActiveWallet } from "@/lib/wallet-adapter";

export function useMultiChain(network = "stacks") {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [txId, setTxId] = useState(null);
  const wallet = getActiveWallet(network);

  const anchor = useCallback(async (hash, title, docType) => {
    setLoading(true); setError(null); setTxId(null);
    try {
      const tx = await wallet.anchor(hash, title, docType);
      setTxId(tx); return tx;
    } catch(e) { setError(e.message); }
    finally { setLoading(false); }
  }, [network]);

  const verify = useCallback(async (hash) => {
    setLoading(true); setError(null);
    try { return await wallet.verify(hash); }
    catch(e) { setError(e.message); return null; }
    finally { setLoading(false); }
  }, [network]);

  return { anchor, verify, loading, error, txId, explorer: wallet.explorer };
}'

bump "0.2.0"

c src/components/ProofVerifyWidget.jsx \
"Add ProofVerifyWidget: embeddable verification widget for third-party sites" \
'"use client";
import { useState } from "react";
import { verifyDocument } from "@/lib/wallet";
export default function ProofVerifyWidget({ initialHash = "", compact = false }) {
  const [hash, setHash] = useState(initialHash);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  async function verify() {
    if (!hash.trim()) return;
    setLoading(true);
    const r = await verifyDocument(hash.trim()).catch(() => null);
    setResult(r); setLoading(false);
  }
  const verified = result && result !== "not_found";
  return (
    <div style={{ border:"3px solid #f5f0e8", padding:compact?12:24, background:"#0a0a0a", fontFamily:"Space Grotesk, sans-serif", maxWidth:compact?320:480 }}>
      {!compact && <div style={{ fontFamily:"Archivo Black, sans-serif", fontSize:14, color:"#F7931A", marginBottom:12, letterSpacing:1 }}>VERIFY DOCUMENT</div>}
      <div style={{ display:"flex", gap:8 }}>
        <input value={hash} onChange={e=>setHash(e.target.value)} placeholder="SHA-256 hash..."
          style={{ flex:1, background:"transparent", border:"2px solid #333", color:"#f5f0e8", padding:"8px 10px", fontFamily:"Space Mono, monospace", fontSize:11, outline:"none" }} />
        <button onClick={verify} disabled={loading}
          style={{ background:"#F7931A", border:"none", color:"#000", padding:"8px 14px", fontFamily:"Archivo Black, sans-serif", fontSize:11, cursor:"pointer" }}>
          {loading?"...":"VERIFY"}
        </button>
      </div>
      {result && (
        <div style={{ marginTop:8, fontSize:11, fontFamily:"Space Mono, monospace", color:verified?"#00ff88":"#ff3333" }}>
          {verified ? `✓ ANCHORED — Block #${result["block-height"]||result.blockHeight}` : "✗ NOT FOUND"}
        </div>
      )}
    </div>
  );
}'

c src/components/AnchorForm.jsx \
"Add AnchorForm: complete document anchoring form with file drop and validation" \
'"use client";
import { useState, useRef } from "react";
import { useHash } from "@/hooks/useHash";
import { useAnchor } from "@/hooks/useAnchor";
const TYPES = ["diploma","certificate","research","art","contribution","award","other"];
export default function AnchorForm({ onSuccess }) {
  const [title, setTitle] = useState("");
  const [docType, setDocType] = useState("diploma");
  const [file, setFile] = useState(null);
  const [dragging, setDragging] = useState(false);
  const fileRef = useRef(null);
  const { hash, hashing, hashFile } = useHash();
  const { anchor, loading, error, txId } = useAnchor();
  async function handleFile(f) { setFile(f); await hashFile(f); }
  async function handleSubmit() {
    if (!hash || !title.trim()) return;
    const tx = await anchor(hash, title.trim(), docType);
    if (tx) onSuccess?.(tx, hash, title, docType);
  }
  const btn = { background:"#F7931A", border:"3px solid #F7931A", color:"#000", padding:"14px", width:"100%", fontFamily:"Archivo Black, sans-serif", fontSize:14, cursor:"pointer", boxShadow:"4px 4px 0 #d4780f" };
  const input = { width:"100%", background:"transparent", border:"3px solid #f5f0e8", color:"#f5f0e8", padding:"12px 16px", fontFamily:"Space Mono, monospace", fontSize:13, outline:"none", marginBottom:16 };
  return (
    <div>
      <div onDragOver={e=>{e.preventDefault();setDragging(true);}} onDragLeave={()=>setDragging(false)}
        onDrop={e=>{e.preventDefault();setDragging(false);handleFile(e.dataTransfer.files[0]);}}
        onClick={()=>fileRef.current?.click()}
        style={{ border:`3px ${dragging?"solid #F7931A":"dashed #444"}`, padding:32, textAlign:"center", cursor:"pointer", marginBottom:16 }}>
        <input ref={fileRef} type="file" style={{display:"none"}} onChange={e=>handleFile(e.target.files[0])} />
        <div style={{ fontFamily:"Archivo Black, sans-serif", fontSize:13, color:"#555" }}>{hashing?"HASHING...":file?file.name:"DROP FILE OR CLICK"}</div>
        {hash && <div style={{ fontFamily:"Space Mono, monospace", fontSize:10, color:"#F7931A", marginTop:8, wordBreak:"break-all" }}>{hash}</div>}
      </div>
      <input style={input} placeholder="Document title..." value={title} onChange={e=>setTitle(e.target.value)} />
      <select style={{...input, background:"#0a0a0a", cursor:"pointer"}} value={docType} onChange={e=>setDocType(e.target.value)}>
        {TYPES.map(t=><option key={t} value={t}>{t.charAt(0).toUpperCase()+t.slice(1)}</option>)}
      </select>
      <button style={btn} onClick={handleSubmit} disabled={loading||!hash||!title.trim()}>
        {loading?"ANCHORING TO BITCOIN...":"ANCHOR DOCUMENT"}
      </button>
      {error && <div style={{ color:"#ff3333", fontFamily:"Space Mono, monospace", fontSize:11, marginTop:8 }}>{error}</div>}
      {txId && <div style={{ color:"#00ff88", fontFamily:"Space Mono, monospace", fontSize:11, marginTop:8 }}>✓ Anchored! TX: {String(txId).slice(0,16)}...</div>}
    </div>
  );
}'

c src/components/ProfileStats.jsx \
"Add ProfileStats: compact stats row for wallet proof profile" \
'"use client";
export default function ProfileStats({ docCount = 0, attestations = 0, nftCount = 0, score = 0 }) {
  const stats = [
    { label: "PROOFS", value: docCount, color: "#F7931A" },
    { label: "ATTESTATIONS", value: attestations, color: "#00ff88" },
    { label: "NFTs", value: nftCount, color: "#a78bfa" },
    { label: "REP SCORE", value: score, color: "#38bdf8" },
  ];
  return (
    <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12, marginBottom:24 }}>
      {stats.map((s,i) => (
        <div key={i} style={{ border:`3px solid ${s.color}`, padding:"12px 8px", textAlign:"center", boxShadow:`3px 3px 0 ${s.color}` }}>
          <div style={{ fontFamily:"Archivo Black, sans-serif", fontSize:24, color:s.color, lineHeight:1 }}>{s.value}</div>
          <div style={{ fontFamily:"Space Mono, monospace", fontSize:9, color:"#666", marginTop:4, letterSpacing:1 }}>{s.label}</div>
        </div>
      ))}
    </div>
  );
}'

c src/components/VerifyResult.jsx \
"Add VerifyResult: styled verification result display component" \
'"use client";
import BlockBadge from "./BlockBadge";
import DocTypeTag from "./DocTypeTag";
import WalletAddress from "./WalletAddress";
export default function VerifyResult({ result, hash, network = "stacks" }) {
  if (!result) return (
    <div style={{ border:"3px solid #ff3333", padding:20, color:"#ff3333", fontFamily:"Space Mono, monospace", fontSize:13 }}>
      <div style={{ fontFamily:"Archivo Black, sans-serif", fontSize:20, marginBottom:8 }}>✗ NOT FOUND</div>
      <div style={{ fontSize:11, color:"#666" }}>This hash has not been anchored on {network === "celo" ? "Celo" : "Bitcoin/Stacks"}</div>
    </div>
  );
  const blockHeight = result["block-height"] || result.blockHeight || result.blockNumber;
  const owner = result.owner;
  const title = result.title;
  const docType = result["doc-type"] || result.docType;
  return (
    <div style={{ border:"3px solid #00ff88", padding:20, boxShadow:"6px 6px 0 #00ff88" }}>
      <div style={{ fontFamily:"Archivo Black, sans-serif", fontSize:22, color:"#00ff88", marginBottom:16 }}>✓ VERIFIED</div>
      {title && <div style={{ fontFamily:"Archivo Black, sans-serif", fontSize:18, color:"#f5f0e8", marginBottom:12 }}>{title}</div>}
      <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginBottom:12 }}>
        {docType && <DocTypeTag type={docType} />}
        {blockHeight && <BlockBadge blockHeight={blockHeight} />}
      </div>
      {owner && <div style={{ marginBottom:8 }}><WalletAddress address={owner} /></div>}
      <div style={{ fontFamily:"Space Mono, monospace", fontSize:10, color:"#444", wordBreak:"break-all", marginTop:12 }}>{hash}</div>
    </div>
  );
}'

bump "0.2.1"

c src/app/api/verify/route.js \
"Add verify API route: POST endpoint for batch document hash verification" \
'import { NextResponse } from "next/server";
const C = "SP1SY1E599GN04XRD2DQBKV7E62HYBJR2CT9S5QKK";
export async function POST(request) {
  try {
    const { hashes } = await request.json();
    if (!Array.isArray(hashes) || hashes.length === 0) return NextResponse.json({ error:"hashes array required" }, { status:400 });
    if (hashes.length > 20) return NextResponse.json({ error:"max 20 hashes per request" }, { status:400 });
    const results = await Promise.allSettled(hashes.map(async hash => {
      const res = await fetch(`https://api.hiro.so/v2/contracts/call-read/${C}/proofleger3/get-doc`, {
        method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ sender:C, arguments:["0x0200000020"+hash] }),
      });
      const data = await res.json();
      return { hash, found: data.okay && data.result !== "0x09" };
    }));
    const response = results.map((r,i) => r.status === "fulfilled" ? r.value : { hash: hashes[i], found: false, error: r.reason?.message });
    return NextResponse.json({ results: response });
  } catch(e) { return NextResponse.json({ error: e.message }, { status:500 }); }
}'

c src/app/api/reputation/route.js \
"Add reputation API route: GET endpoint to compute wallet reputation score" \
'import { NextResponse } from "next/server";
const C = "SP1SY1E599GN04XRD2DQBKV7E62HYBJR2CT9S5QKK";
const SCORES = { diploma:50, research:40, certificate:30, art:20, contribution:20, award:10, other:10 };
const TIERS = [{min:1000,label:"Legend"},{min:500,label:"Authority"},{min:250,label:"Expert"},{min:100,label:"Contributor"},{min:0,label:"Builder"}];
export async function GET(request) {
  const address = new URL(request.url).searchParams.get("address");
  if (!address?.startsWith("SP")) return NextResponse.json({ error:"Invalid address" }, { status:400 });
  try {
    const res = await fetch(`https://api.hiro.so/extended/v1/address/${address}/transactions?limit=50`);
    const data = await res.json();
    const txs = (data.results||[]).filter(t => t.tx_status==="success" && t.tx_type==="contract_call");
    let score = 0;
    for (const tx of txs) {
      const fn = tx.contract_call?.function_name || "";
      if (fn.includes("store")) score += 10;
      if (fn.includes("attest")) score += 5;
      if (fn.includes("mint")) score += 25;
    }
    const tier = TIERS.find(t => score >= t.min) || TIERS[TIERS.length-1];
    return NextResponse.json({ address, score, tier: tier.label, transactions: txs.length });
  } catch(e) { return NextResponse.json({ error:e.message }, { status:500 }); }
}'

c src/app/api/search/route.js \
"Add search API route: GET endpoint to search proofs by wallet or keyword" \
'import { NextResponse } from "next/server";
const API = "https://api.hiro.so";
const C = "SP1SY1E599GN04XRD2DQBKV7E62HYBJR2CT9S5QKK";
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const wallet = searchParams.get("wallet");
  const limit = Math.min(parseInt(searchParams.get("limit")||"20"), 50);
  if (!wallet) return NextResponse.json({ error:"wallet param required" }, { status:400 });
  try {
    const res = await fetch(`${API}/extended/v1/address/${wallet}/transactions?limit=${limit}`);
    const data = await res.json();
    const proofs = (data.results||[])
      .filter(t => t.tx_status==="success" && t.contract_call?.function_name?.includes("store"))
      .map(t => ({ txid:t.tx_id, block:t.block_height, fn:t.contract_call?.function_name }));
    return NextResponse.json({ wallet, proofs, total: proofs.length });
  } catch(e) { return NextResponse.json({ error:e.message }, { status:500 }); }
}'

c docs/api-routes.md \
"Add API routes docs: all Next.js API endpoints with examples" \
'# ProofLedger API Routes

## GET /api/proof?hash={sha256}
Verify a single document hash.

## POST /api/verify
Batch verify up to 20 hashes.
```json
{ "hashes": ["a1b2...", "c3d4..."] }
```

## GET /api/stats
Protocol statistics.

## GET /api/profile?address={SP...}
Wallet proof profile.

## GET /api/reputation?address={SP...}
Compute wallet reputation score and tier.

## GET /api/search?wallet={SP...}
Search proofs by wallet address.

## POST /api/hash
Server-side SHA-256 of text content.
```json
{ "text": "my document" }
```'

c docs/components.md \
"Add components docs: all React components with props reference" \
'# ProofLedger Components

## Proof Components
- `ProofCard` — full proof display with actions
- `CeloProofCard` — Celo network proof display
- `ProofVerifyWidget` — embeddable verification widget
- `VerifyResult` — styled verification result

## Form Components
- `AnchorForm` — complete document anchoring form
- `FileDropZone` — drag-and-drop file hashing
- `ChainSelector` — Stacks/Celo network toggle

## Profile Components
- `ReputationBadge` — tier display with score
- `ProfileStats` — compact stats row

## UI Components
- `BlockBadge` — block height with Bitcoin indicator
- `DocTypeTag` — colored document type tag
- `WalletAddress` — truncated address with explorer link
- `AttestationCount` — attestation count display
- `Toast` — auto-dismiss notification
- `Spinner` — loading indicator
- `EmptyState` — empty state placeholder
- `NFTCard` — soulbound NFT display
- `TxLink` / `CeloTxLink` — transaction explorer links'

bump "0.2.2"

echo -e "${YELLOW}Pushing...${NC}"
git push origin main -q

echo -e "${GREEN}Done! $TOTAL commits. Version 0.2.2${NC}"
echo "Run: cd ~/path/to/@greyw0rks-proofleger && npm publish"
