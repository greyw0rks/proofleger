#!/bin/bash
# ProofLedger App - Daily Commits April 17
# cd proofleger && bash daily_app_apr17.sh

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

echo -e "${YELLOW}Daily commits Apr 17 starting...${NC}"

# ── Context providers ─────────────────────────────────────────

c src/context/WalletContext.js \
"Add WalletContext: global wallet state provider for Stacks" \
'"use client";
import { createContext, useContext, useState, useCallback } from "react";
import { connect, disconnect, getAddress, isWalletConnected } from "@/lib/wallet";

const WalletContext = createContext(null);

export function WalletProvider({ children }) {
  const [address, setAddress] = useState(null);
  const [connecting, setConnecting] = useState(false);

  const connectWallet = useCallback(async () => {
    setConnecting(true);
    try {
      await connect();
      const addr = getAddress();
      setAddress(addr);
      return addr;
    } catch(e) {
      console.error(e);
    } finally { setConnecting(false); }
  }, []);

  const disconnectWallet = useCallback(() => {
    disconnect();
    setAddress(null);
  }, []);

  return (
    <WalletContext.Provider value={{ address, connecting, connectWallet, disconnectWallet, isConnected: !!address }}>
      {children}
    </WalletContext.Provider>
  );
}

export const useWalletContext = () => {
  const ctx = useContext(WalletContext);
  if (!ctx) throw new Error("useWalletContext must be used inside WalletProvider");
  return ctx;
};'

c src/context/NetworkContext.js \
"Add NetworkContext: global active network state (Stacks or Celo)" \
'"use client";
import { createContext, useContext, useState, useCallback } from "react";

const NetworkContext = createContext(null);

export const NETWORKS = {
  STACKS: { id: "stacks", label: "Stacks", color: "#F7931A", chain: "mainnet" },
  CELO:   { id: "celo",   label: "Celo",   color: "#35D07F", chain: "celo-mainnet" },
};

export function NetworkProvider({ children }) {
  const [network, setNetwork] = useState(NETWORKS.STACKS);

  const switchNetwork = useCallback((id) => {
    const n = Object.values(NETWORKS).find(n => n.id === id);
    if (n) setNetwork(n);
  }, []);

  return (
    <NetworkContext.Provider value={{ network, switchNetwork, isStacks: network.id === "stacks", isCelo: network.id === "celo" }}>
      {children}
    </NetworkContext.Provider>
  );
}

export const useNetworkContext = () => useContext(NetworkContext);'

c src/context/ProofContext.js \
"Add ProofContext: global proof draft state and recent anchors cache" \
'"use client";
import { createContext, useContext, useState, useCallback } from "react";

const ProofContext = createContext(null);

export function ProofProvider({ children }) {
  const [draft, setDraft] = useState({ hash: null, title: "", docType: "diploma", file: null });
  const [recentProofs, setRecentProofs] = useState([]);

  const updateDraft = useCallback((updates) => {
    setDraft(d => ({ ...d, ...updates }));
  }, []);

  const clearDraft = useCallback(() => {
    setDraft({ hash: null, title: "", docType: "diploma", file: null });
  }, []);

  const addRecentProof = useCallback((proof) => {
    setRecentProofs(prev => [proof, ...prev].slice(0, 20));
  }, []);

  return (
    <ProofContext.Provider value={{ draft, updateDraft, clearDraft, recentProofs, addRecentProof }}>
      {children}
    </ProofContext.Provider>
  );
}

export const useProofContext = () => useContext(ProofContext);'

c src/context/ThemeContext.js \
"Add ThemeContext: global theme and accent color management" \
'"use client";
import { createContext, useContext, useState } from "react";

const ThemeContext = createContext(null);

export const ACCENTS = {
  bitcoin: "#F7931A",
  celo:    "#35D07F",
  purple:  "#a78bfa",
  blue:    "#38bdf8",
};

export function ThemeProvider({ children }) {
  const [accent, setAccent] = useState(ACCENTS.bitcoin);

  return (
    <ThemeContext.Provider value={{ accent, setAccent, ACCENTS }}>
      <style>{`:root { --accent: ${accent}; }`}</style>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);'

# ── New pages ─────────────────────────────────────────────────

c src/app/profile/[wallet]/page.js \
"Add profile page: public on-chain proof profile for any wallet" \
'"use client";
import { use } from "react";
import { useProfile } from "@/hooks/useProfile";
import ProfileHeader from "@/components/ProfileHeader";
import ProfileStats from "@/components/ProfileStats";
import ProofHistory from "@/components/ProofHistory";
import ReputationBadge from "@/components/ReputationBadge";

export default function ProfilePage({ params }) {
  const { wallet } = use(params);
  const { profile, loading } = useProfile(wallet);

  if (loading) return (
    <div style={{ minHeight:"100vh", background:"#0a0a0a", display:"flex",
      alignItems:"center", justifyContent:"center",
      color:"#666", fontFamily:"Space Mono, monospace", fontSize:12 }}>
      Loading profile...
    </div>
  );

  return (
    <div style={{ maxWidth:720, margin:"0 auto", padding:"40px 24px",
      fontFamily:"Space Grotesk, sans-serif", color:"#f5f0e8", minHeight:"100vh",
      background:"#0a0a0a" }}>
      <ProfileHeader
        address={wallet}
        score={profile?.reputation?.score || 0}
        docCount={profile?.anchors || 0}
      />
      <ProfileStats
        docCount={profile?.anchors || 0}
        attestations={profile?.attests || 0}
        nftCount={profile?.nfts || 0}
        score={profile?.reputation?.score || 0}
      />
      <ReputationBadge score={profile?.reputation?.score || 0} showScore />
      <div style={{ marginTop:32 }}>
        <div style={{ fontFamily:"Archivo Black, sans-serif", fontSize:13,
          color:"#555", marginBottom:16, letterSpacing:2 }}>TRANSACTION HISTORY</div>
        <ProofHistory address={wallet} />
      </div>
    </div>
  );
}'

c src/app/cv/[wallet]/page.js \
"Add CV page: printable decentralized CV from on-chain proof data" \
'"use client";
import { use } from "react";
import { useProfile } from "@/hooks/useProfile";
import CVSection from "@/components/CVSection";
import ReputationBadge from "@/components/ReputationBadge";

export default function CVPage({ params }) {
  const { wallet } = use(params);
  const { profile, loading } = useProfile(wallet);

  return (
    <div style={{ maxWidth:800, margin:"40px auto", padding:"0 24px",
      fontFamily:"Space Grotesk, sans-serif", color:"#f5f0e8" }}>
      <div style={{ display:"flex", justifyContent:"space-between",
        alignItems:"flex-start", marginBottom:32 }}>
        <div>
          <div style={{ fontFamily:"Archivo Black, sans-serif", fontSize:28,
            color:"#f5f0e8", marginBottom:4 }}>
            {wallet.slice(0,8)}...{wallet.slice(-6)}
          </div>
          <div style={{ fontFamily:"Space Mono, monospace", fontSize:11, color:"#555" }}>
            {wallet}
          </div>
        </div>
        <div style={{ textAlign:"right" }}>
          <ReputationBadge score={profile?.reputation?.score || 0} />
          <div style={{ fontFamily:"Space Mono, monospace", fontSize:10,
            color:"#555", marginTop:6 }}>
            ProofLedger Verified Profile
          </div>
        </div>
      </div>

      <CVSection title="Proof Summary" accent="#F7931A">
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:12 }}>
          {[["Documents", profile?.anchors||0],
            ["Attestations", profile?.attests||0],
            ["NFTs Minted", profile?.nfts||0]].map(([k,v]) => (
            <div key={k} style={{ border:"2px solid #222", padding:12, textAlign:"center" }}>
              <div style={{ fontFamily:"Archivo Black, sans-serif", fontSize:24,
                color:"#F7931A" }}>{v}</div>
              <div style={{ fontFamily:"Space Mono, monospace", fontSize:9,
                color:"#555", marginTop:4 }}>{k.toUpperCase()}</div>
            </div>
          ))}
        </div>
      </CVSection>

      <CVSection title="Blockchain Identity" accent="#38bdf8">
        <div style={{ fontFamily:"Space Mono, monospace", fontSize:11, color:"#888" }}>
          <div>Network: Stacks Mainnet (Bitcoin L2)</div>
          <div style={{ marginTop:6 }}>Address: {wallet}</div>
          <div style={{ marginTop:6 }}>
            <a href={`https://explorer.hiro.so/address/${wallet}`}
              target="_blank" rel="noreferrer"
              style={{ color:"#F7931A", textDecoration:"none" }}>
              View on Hiro Explorer ↗
            </a>
          </div>
        </div>
      </CVSection>

      <div style={{ marginTop:32, borderTop:"2px solid #1a1a1a", paddingTop:16,
        fontFamily:"Space Mono, monospace", fontSize:9, color:"#444", textAlign:"center" }}>
        Generated by ProofLedger · proofleger.vercel.app · All data is on-chain and verifiable
      </div>
    </div>
  );
}'

c src/app/credential/[hash]/page.js \
"Add credential page: display a specific credential with attestations" \
'"use client";
import { use, useState, useEffect } from "react";
import { verifyDocument } from "@/lib/wallet";
import VerifyResult from "@/components/VerifyResult";
import TxLink from "@/components/TxLink";

export default function CredentialPage({ params }) {
  const { hash } = use(params);
  const [proof, setProof] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    verifyDocument(hash)
      .then(r => { setProof(r); setLoading(false); })
      .catch(() => setLoading(false));
  }, [hash]);

  return (
    <div style={{ maxWidth:640, margin:"60px auto", padding:"0 24px",
      fontFamily:"Space Grotesk, sans-serif", color:"#f5f0e8", minHeight:"100vh",
      background:"#0a0a0a" }}>
      <div style={{ fontFamily:"Space Mono, monospace", fontSize:10, color:"#555", marginBottom:20 }}>
        CREDENTIAL RECORD
      </div>
      {loading
        ? <div style={{ color:"#666", fontFamily:"Space Mono, monospace" }}>Verifying on Bitcoin...</div>
        : <VerifyResult result={proof} hash={hash} />
      }
      <div style={{ marginTop:20, display:"flex", gap:12 }}>
        <a href={`/certificate/${hash}`}
          style={{ border:"2px solid #F7931A", color:"#F7931A", padding:"8px 16px",
            fontFamily:"Archivo Black, sans-serif", fontSize:11, textDecoration:"none" }}>
          VIEW CERTIFICATE
        </a>
        <a href={`/verify?hash=${hash}`}
          style={{ border:"2px solid #333", color:"#666", padding:"8px 16px",
            fontFamily:"Archivo Black, sans-serif", fontSize:11, textDecoration:"none" }}>
          VERIFY AGAIN
        </a>
      </div>
    </div>
  );
}'

c src/app/collection/[id]/page.js \
"Add collection detail page: view documents in a specific collection" \
'"use client";
import { use } from "react";
export default function CollectionDetailPage({ params }) {
  const { id } = use(params);
  return (
    <div style={{ maxWidth:720, margin:"0 auto", padding:"40px 24px",
      fontFamily:"Space Grotesk, sans-serif", color:"#f5f0e8", minHeight:"100vh",
      background:"#0a0a0a" }}>
      <a href="/collections" style={{ fontFamily:"Space Mono, monospace", fontSize:11,
        color:"#555", textDecoration:"none", display:"block", marginBottom:20 }}>
        ← COLLECTIONS
      </a>
      <h1 style={{ fontFamily:"Archivo Black, sans-serif", fontSize:24, marginBottom:8 }}>
        Collection #{id}
      </h1>
      <p style={{ color:"#666", fontFamily:"Space Mono, monospace", fontSize:12 }}>
        On-chain document collection · ID: {id}
      </p>
    </div>
  );
}'

c src/app/search/page.js \
"Add search page: search documents by hash, wallet, or title" \
'"use client";
import { useState } from "react";
import SearchBar from "@/components/SearchBar";
export default function SearchPage() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  async function handleSearch(query) {
    if (!query || query.length < 3) return;
    setLoading(true); setSearched(true);
    try {
      const res = await fetch(`/api/search?wallet=${query}`);
      const data = await res.json();
      setResults(data.proofs || []);
    } catch { setResults([]); }
    finally { setLoading(false); }
  }

  return (
    <div style={{ maxWidth:720, margin:"0 auto", padding:"40px 24px",
      fontFamily:"Space Grotesk, sans-serif", color:"#f5f0e8", minHeight:"100vh",
      background:"#0a0a0a" }}>
      <h1 style={{ fontFamily:"Archivo Black, sans-serif", fontSize:28, marginBottom:8 }}>SEARCH</h1>
      <p style={{ color:"#888", marginBottom:24, fontSize:13 }}>
        Search by wallet address, document hash, or transaction ID
      </p>
      <SearchBar onSearch={handleSearch} placeholder="SP address or hash..." />
      {loading && <div style={{ color:"#666", fontFamily:"Space Mono, monospace", fontSize:12 }}>Searching...</div>}
      {searched && !loading && results.length === 0 && (
        <div style={{ color:"#555", fontFamily:"Space Mono, monospace", fontSize:12 }}>No results found</div>
      )}
      {results.map((r, i) => (
        <div key={i} style={{ border:"2px solid #222", padding:16, marginBottom:8 }}>
          <div style={{ fontFamily:"Space Mono, monospace", fontSize:11, color:"#F7931A" }}>
            {r.fn}
          </div>
          <div style={{ fontFamily:"Space Mono, monospace", fontSize:10, color:"#555", marginTop:4 }}>
            Block #{r.block} · <a href={`/verify?hash=${r.txid}`}
              style={{ color:"#666", textDecoration:"none" }}>{r.txid?.slice(0,12)}...</a>
          </div>
        </div>
      ))}
    </div>
  );
}'

c src/app/badge/[id]/page.js \
"Update badge page: display achievement badge with metadata and share" \
'"use client";
import { use } from "react";
import { useClipboard } from "@/hooks/useClipboard";

const BADGE_META = {
  "top-contributor": { emoji:"🏆", title:"Top Contributor", desc:"Awarded to the most active ProofLedger contributors", color:"#F7931A" },
  "first-anchor":    { emoji:"⚓", title:"First Anchor", desc:"Anchored your first document to Bitcoin", color:"#38bdf8" },
  "verified-issuer": { emoji:"✓",  title:"Verified Issuer", desc:"Recognized trusted credential issuer", color:"#00ff88" },
  "100-proofs":      { emoji:"💯", title:"Century Mark", desc:"Anchored 100 documents to Bitcoin", color:"#a78bfa" },
};

export default function BadgePage({ params }) {
  const { id } = use(params);
  const { copy, copied } = useClipboard();
  const meta = BADGE_META[id] || { emoji:"🎖️", title:`Badge: ${id}`, desc:"ProofLedger Achievement", color:"#F7931A" };
  const shareUrl = typeof window !== "undefined" ? window.location.href : "";

  return (
    <div style={{ minHeight:"100vh", background:"#0a0a0a", display:"flex",
      alignItems:"center", justifyContent:"center", padding:24 }}>
      <div style={{ border:`3px solid ${meta.color}`, padding:40, textAlign:"center",
        boxShadow:`8px 8px 0 ${meta.color}`, maxWidth:400, width:"100%" }}>
        <div style={{ fontSize:56, marginBottom:16 }}>{meta.emoji}</div>
        <div style={{ fontFamily:"Archivo Black, sans-serif", fontSize:22,
          color:meta.color, marginBottom:8 }}>{meta.title}</div>
        <div style={{ fontFamily:"Space Grotesk, sans-serif", fontSize:13,
          color:"#666", marginBottom:24, lineHeight:1.6 }}>{meta.desc}</div>
        <div style={{ display:"flex", gap:8, justifyContent:"center" }}>
          <button onClick={() => copy(shareUrl)}
            style={{ border:`2px solid ${meta.color}`, background:"transparent",
              color:meta.color, padding:"8px 16px", fontFamily:"Archivo Black, sans-serif",
              fontSize:11, cursor:"pointer" }}>
            {copied ? "COPIED!" : "SHARE"}
          </button>
          <a href="/"
            style={{ border:"2px solid #333", color:"#666", padding:"8px 16px",
              fontFamily:"Archivo Black, sans-serif", fontSize:11, textDecoration:"none" }}>
            HOME
          </a>
        </div>
      </div>
    </div>
  );
}'

# ── More hooks ────────────────────────────────────────────────

c src/hooks/useTransactionStatus.js \
"Add useTransactionStatus hook: poll Stacks TX status until confirmed" \
'"use client";
import { useState, useEffect, useCallback, useRef } from "react";

const API = "https://api.hiro.so";
const POLL_INTERVAL = 10_000;

export function useTransactionStatus(txId) {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [blockHeight, setBlockHeight] = useState(null);
  const timer = useRef(null);

  const check = useCallback(async () => {
    if (!txId) return;
    try {
      const res = await fetch(`${API}/extended/v1/tx/${txId}`);
      const data = await res.json();
      setStatus(data.tx_status);
      setBlockHeight(data.block_height || null);
      if (data.tx_status === "success" || data.tx_status === "abort_by_response") {
        clearInterval(timer.current);
        setLoading(false);
      }
    } catch {}
  }, [txId]);

  useEffect(() => {
    if (!txId) return;
    setLoading(true); setStatus("pending");
    check();
    timer.current = setInterval(check, POLL_INTERVAL);
    return () => clearInterval(timer.current);
  }, [txId]);

  return { status, loading, blockHeight,
    isPending: status === "pending",
    isSuccess: status === "success",
    isFailed: status === "abort_by_response" };
}'

c src/hooks/usePagination.js \
"Add usePagination hook: generic pagination state management" \
'"use client";
import { useState, useMemo } from "react";

export function usePagination(items = [], pageSize = 10) {
  const [page, setPage] = useState(0);

  const totalPages = Math.ceil(items.length / pageSize);

  const pageItems = useMemo(() => {
    const start = page * pageSize;
    return items.slice(start, start + pageSize);
  }, [items, page, pageSize]);

  return {
    page,
    pageItems,
    totalPages,
    hasNext: page < totalPages - 1,
    hasPrev: page > 0,
    next: () => setPage(p => Math.min(p + 1, totalPages - 1)),
    prev: () => setPage(p => Math.max(p - 1, 0)),
    goTo: setPage,
    reset: () => setPage(0),
  };
}'

c src/hooks/useForm.js \
"Add useForm hook: form state, validation, and submission handler" \
'"use client";
import { useState, useCallback } from "react";

export function useForm(initialValues = {}, validators = {}) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const setValue = useCallback((field, value) => {
    setValues(v => ({ ...v, [field]: value }));
    if (validators[field]) {
      const err = validators[field](value);
      setErrors(e => ({ ...e, [field]: err || null }));
    }
  }, [validators]);

  const touch = useCallback((field) => {
    setTouched(t => ({ ...t, [field]: true }));
  }, []);

  const validate = useCallback(() => {
    const newErrors = {};
    Object.entries(validators).forEach(([field, fn]) => {
      const err = fn(values[field]);
      if (err) newErrors[field] = err;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [values, validators]);

  const handleSubmit = useCallback((onSubmit) => async (e) => {
    e?.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try { await onSubmit(values); }
    finally { setSubmitting(false); }
  }, [values, validate]);

  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  }, []);

  return { values, errors, touched, submitting, setValue, touch, validate, handleSubmit, reset };
}'

c src/hooks/useInterval.js \
"Add useInterval hook: safe setInterval with automatic cleanup" \
'"use client";
import { useEffect, useRef } from "react";

export function useInterval(callback, delay) {
  const savedCallback = useRef(callback);

  useEffect(() => { savedCallback.current = callback; }, [callback]);

  useEffect(() => {
    if (delay === null || delay === undefined) return;
    const id = setInterval(() => savedCallback.current(), delay);
    return () => clearInterval(id);
  }, [delay]);
}'

c src/hooks/useTimeout.js \
"Add useTimeout hook: safe setTimeout with automatic cleanup" \
'"use client";
import { useEffect, useRef, useCallback } from "react";

export function useTimeout(callback, delay) {
  const savedCallback = useRef(callback);
  useEffect(() => { savedCallback.current = callback; }, [callback]);
  useEffect(() => {
    if (delay === null || delay === undefined) return;
    const id = setTimeout(() => savedCallback.current(), delay);
    return () => clearTimeout(id);
  }, [delay]);
}

export function useDelayedAction() {
  const timer = useRef(null);
  const run = useCallback((fn, delay) => {
    clearTimeout(timer.current);
    timer.current = setTimeout(fn, delay);
  }, []);
  const cancel = useCallback(() => clearTimeout(timer.current), []);
  useEffect(() => () => clearTimeout(timer.current), []);
  return { run, cancel };
}'

# ── More components ───────────────────────────────────────────

c src/components/TxStatusBadge.jsx \
"Add TxStatusBadge: transaction status indicator with polling" \
'"use client";
import { useTransactionStatus } from "@/hooks/useTransactionStatus";
import Badge from "./Badge";

export default function TxStatusBadge({ txId }) {
  const { status, isPending, isSuccess, isFailed, blockHeight } = useTransactionStatus(txId);

  if (!txId) return null;

  const variant = isSuccess ? "success" : isFailed ? "error" : "warning";
  const label = isSuccess
    ? `CONFIRMED · Block #${blockHeight}`
    : isFailed ? "FAILED"
    : "PENDING...";

  return (
    <div style={{ display:"flex", alignItems:"center", gap:8 }}>
      <Badge label={label} variant={variant} dot />
      <a href={`https://explorer.hiro.so/txid/${txId}`}
        target="_blank" rel="noreferrer"
        style={{ fontFamily:"Space Mono, monospace", fontSize:10,
          color:"#555", textDecoration:"none" }}>
        {txId.slice(0,10)}... ↗
      </a>
    </div>
  );
}'

c src/components/PaginationBar.jsx \
"Add PaginationBar: pagination controls for document lists" \
'"use client";
export default function PaginationBar({ page, totalPages, hasNext, hasPrev, next, prev, goTo }) {
  if (totalPages <= 1) return null;
  return (
    <div style={{ display:"flex", alignItems:"center", gap:8, marginTop:16 }}>
      <button onClick={prev} disabled={!hasPrev}
        style={{ border:"2px solid #333", background:"transparent",
          color: hasPrev ? "#f5f0e8" : "#444", padding:"6px 14px",
          fontFamily:"Archivo Black, sans-serif", fontSize:10,
          cursor: hasPrev ? "pointer" : "default" }}>← PREV</button>
      <div style={{ display:"flex", gap:4 }}>
        {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => (
          <button key={i} onClick={() => goTo(i)}
            style={{ width:28, height:28, border:`2px solid ${i===page?"#F7931A":"#333"}`,
              background: i===page ? "#F7931A" : "transparent",
              color: i===page ? "#000" : "#888",
              fontFamily:"Archivo Black, sans-serif", fontSize:10, cursor:"pointer" }}>
            {i + 1}
          </button>
        ))}
      </div>
      <button onClick={next} disabled={!hasNext}
        style={{ border:"2px solid #333", background:"transparent",
          color: hasNext ? "#f5f0e8" : "#444", padding:"6px 14px",
          fontFamily:"Archivo Black, sans-serif", fontSize:10,
          cursor: hasNext ? "pointer" : "default" }}>NEXT →</button>
    </div>
  );
}'

c src/components/DocGrid.jsx \
"Add DocGrid: responsive grid layout for proof document cards" \
'"use client";
import ProofCard from "./ProofCard";
import EmptyState from "./EmptyState";
import PaginationBar from "./PaginationBar";
import { usePagination } from "@/hooks/usePagination";

export default function DocGrid({ docs = [], onAttest, onMint, walletAddress, pageSize = 9 }) {
  const { pageItems, ...pagination } = usePagination(docs, pageSize);

  if (docs.length === 0) return (
    <EmptyState
      title="NO DOCUMENTS YET"
      subtitle="Anchor your first document to Bitcoin to get started"
      action="ANCHOR DOCUMENT"
    />
  );

  return (
    <div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))", gap:16 }}>
        {pageItems.map((doc, i) => (
          <ProofCard key={i}
            hash={doc.hash}
            title={doc.title}
            docType={doc["doc-type"] || doc.docType}
            blockHeight={doc["block-height"] || doc.blockHeight}
            owner={doc.owner}
            attestations={doc.attestations || 0}
            isOwner={doc.owner === walletAddress}
            onAttest={onAttest}
            onMint={onMint}
          />
        ))}
      </div>
      <PaginationBar {...pagination} />
    </div>
  );
}'

c src/components/NetworkSwitchModal.jsx \
"Add NetworkSwitchModal: prompt user to switch chain when needed" \
'"use client";
import Modal from "./Modal";

export default function NetworkSwitchModal({ open, onClose, onSwitch, targetNetwork = "celo" }) {
  const config = {
    celo:   { label:"Celo Mainnet", color:"#35D07F", desc:"Switch to Celo for sub-cent transactions via MiniPay" },
    stacks: { label:"Stacks Mainnet", color:"#F7931A", desc:"Switch to Stacks to anchor documents to Bitcoin" },
  };
  const net = config[targetNetwork] || config.stacks;
  return (
    <Modal open={open} onClose={onClose} title="SWITCH NETWORK">
      <p style={{ fontFamily:"Space Grotesk, sans-serif", fontSize:13,
        color:"#888", marginBottom:20 }}>{net.desc}</p>
      <div style={{ display:"flex", gap:8 }}>
        <button onClick={onSwitch}
          style={{ flex:1, background:net.color, border:`3px solid ${net.color}`,
            color:"#000", padding:14, fontFamily:"Archivo Black, sans-serif",
            fontSize:13, cursor:"pointer" }}>
          SWITCH TO {net.label.toUpperCase()}
        </button>
        <button onClick={onClose}
          style={{ border:"3px solid #333", background:"transparent",
            color:"#666", padding:"14px 20px", fontFamily:"Archivo Black, sans-serif",
            fontSize:13, cursor:"pointer" }}>
          CANCEL
        </button>
      </div>
    </Modal>
  );
}'

c src/components/CredentialIssuance.jsx \
"Add CredentialIssuance: UI for issuers to send credentials to recipients" \
'"use client";
import { useState } from "react";
import { useAnchor } from "@/hooks/useAnchor";
import { useHash } from "@/hooks/useHash";

export default function CredentialIssuance({ issuerAddress }) {
  const [recipient, setRecipient] = useState("");
  const [title, setTitle] = useState("");
  const [type, setType] = useState("certificate");
  const { hashText } = useHash();
  const { anchor, loading, txId, error } = useAnchor();

  async function issue() {
    if (!recipient || !title) return;
    const content = `${type}:${title}:${recipient}:${Date.now()}`;
    const hash = await hashText(content);
    await anchor(hash, title, type);
  }

  const input = { width:"100%", background:"transparent", border:"3px solid #333",
    color:"#f5f0e8", padding:"10px 14px", fontFamily:"Space Mono, monospace",
    fontSize:12, outline:"none", marginBottom:12 };

  return (
    <div style={{ border:"3px solid #f5f0e8", padding:24, boxShadow:"6px 6px 0 #f5f0e8" }}>
      <div style={{ fontFamily:"Archivo Black, sans-serif", fontSize:14,
        color:"#F7931A", marginBottom:16, letterSpacing:1 }}>ISSUE CREDENTIAL</div>
      <input style={input} placeholder="Recipient SP address..."
        value={recipient} onChange={e=>setRecipient(e.target.value)} />
      <input style={input} placeholder="Credential title..."
        value={title} onChange={e=>setTitle(e.target.value)} />
      <select style={{...input, background:"#0a0a0a", cursor:"pointer"}}
        value={type} onChange={e=>setType(e.target.value)}>
        {["certificate","diploma","award","contribution"].map(t =>
          <option key={t} value={t}>{t.charAt(0).toUpperCase()+t.slice(1)}</option>
        )}
      </select>
      <button onClick={issue} disabled={loading||!recipient||!title}
        style={{ width:"100%", background:"#F7931A", border:"3px solid #F7931A",
          color:"#000", padding:14, fontFamily:"Archivo Black, sans-serif",
          fontSize:13, cursor:"pointer" }}>
        {loading ? "ISSUING..." : "ISSUE CREDENTIAL"}
      </button>
      {txId && <div style={{ marginTop:12, fontFamily:"Space Mono, monospace",
        fontSize:10, color:"#00ff88" }}>✓ Issued! TX: {String(txId).slice(0,16)}...</div>}
      {error && <div style={{ marginTop:12, fontFamily:"Space Mono, monospace",
        fontSize:10, color:"#ff3333" }}>{error}</div>}
    </div>
  );
}'

# ── More utils ────────────────────────────────────────────────

c src/utils/sort.js \
"Add sort utils: flexible sort functions for proof record arrays" \
'export function sortByNewest(items) {
  return [...items].sort((a, b) => (b["block-height"]||b.blockHeight||0) - (a["block-height"]||a.blockHeight||0));
}
export function sortByOldest(items) {
  return [...items].sort((a, b) => (a["block-height"]||a.blockHeight||0) - (b["block-height"]||b.blockHeight||0));
}
export function sortByAttestations(items) {
  return [...items].sort((a, b) => (b.attestations||0) - (a.attestations||0));
}
export function sortByType(items) {
  return [...items].sort((a, b) => {
    const ta = a["doc-type"]||a.docType||"";
    const tb = b["doc-type"]||b.docType||"";
    return ta.localeCompare(tb);
  });
}
export function applySort(items, sortKey) {
  switch(sortKey) {
    case "newest": return sortByNewest(items);
    case "oldest": return sortByOldest(items);
    case "attestations": return sortByAttestations(items);
    case "type": return sortByType(items);
    default: return items;
  }
}'

c src/utils/group.js \
"Add group utils: group proof records by type, date, or block range" \
'export function groupByType(items) {
  return items.reduce((acc, item) => {
    const type = item["doc-type"] || item.docType || "other";
    if (!acc[type]) acc[type] = [];
    acc[type].push(item);
    return acc;
  }, {});
}

export function groupByMonth(items) {
  return items.reduce((acc, item) => {
    const date = item.timestamp ? new Date(item.timestamp * 1000) : new Date();
    const key = `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,"0")}`;
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {});
}

export function groupByNetwork(items) {
  return items.reduce((acc, item) => {
    const net = item.network || "stacks";
    if (!acc[net]) acc[net] = [];
    acc[net].push(item);
    return acc;
  }, {});
}'

c src/utils/tx.js \
"Add tx utils: parse and decode Stacks transaction data" \
'export function parseTxType(tx) {
  if (!tx) return "unknown";
  if (tx.tx_type === "contract_call") return tx.contract_call?.function_name || "contract_call";
  return tx.tx_type || "unknown";
}

export function isCoreProofTx(tx) {
  if (!tx || tx.tx_status !== "success") return false;
  const fn = tx.contract_call?.function_name || "";
  return fn.includes("store") || fn.includes("anchor");
}

export function isAttestTx(tx) {
  return tx?.tx_status === "success" && (tx.contract_call?.function_name || "").includes("attest");
}

export function isMintTx(tx) {
  return tx?.tx_status === "success" && (tx.contract_call?.function_name || "").includes("mint");
}

export function txExplorerUrl(txId) {
  return `https://explorer.hiro.so/txid/${txId}`;
}

export function addressExplorerUrl(address) {
  return `https://explorer.hiro.so/address/${address}`;
}'

c src/utils/time.js \
"Add time utils: block time calculations and countdown helpers" \
'const STACKS_BLOCK_TIME_S = 600; // ~10 minutes

export function blocksToSeconds(blocks) {
  return blocks * STACKS_BLOCK_TIME_S;
}

export function blocksToMinutes(blocks) {
  return Math.round(blocksToSeconds(blocks) / 60);
}

export function blocksToHours(blocks) {
  return (blocksToSeconds(blocks) / 3600).toFixed(1);
}

export function blocksToDays(blocks) {
  return (blocksToSeconds(blocks) / 86400).toFixed(1);
}

export function estimateBlockDate(targetBlock, currentBlock, currentDate = new Date()) {
  const diffBlocks = targetBlock - currentBlock;
  const diffMs = diffBlocks * STACKS_BLOCK_TIME_S * 1000;
  return new Date(currentDate.getTime() + diffMs);
}

export function formatDuration(ms) {
  const s = Math.floor(ms / 1000);
  if (s < 60) return `${s}s`;
  if (s < 3600) return `${Math.floor(s/60)}m`;
  if (s < 86400) return `${Math.floor(s/3600)}h`;
  return `${Math.floor(s/86400)}d`;
}'

c src/lib/stacks-api.js \
"Add stacks-api: typed wrapper for Hiro REST API endpoints" \
'const BASE = "https://api.hiro.so";

async function get(path) {
  const res = await fetch(`${BASE}${path}`);
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${path}`);
  return res.json();
}

export const StacksAPI = {
  getAccountInfo: (addr) => get(`/v2/accounts/${addr}?proof=0&unanchored=true`),
  getAccountTransactions: (addr, limit=20, offset=0) =>
    get(`/extended/v1/address/${addr}/transactions?limit=${limit}&offset=${offset}`),
  getTransaction: (txid) => get(`/extended/v1/tx/${txid}`),
  getContractInfo: (addr, name) => get(`/v2/contracts/interface/${addr}/${name}`),
  getContractTransactions: (addr, name, limit=50) =>
    get(`/extended/v1/address/${addr}.${name}/transactions?limit=${limit}`),
  getNFTHoldings: (addr, assetId) =>
    get(`/extended/v1/tokens/nft/holdings?principal=${addr}&asset_identifiers=${assetId}`),
  getNetworkInfo: () => get(`/v2/info`),
  getFeeEstimate: () => get(`/v2/fees/transfer`),
};'

c src/lib/doc-store.js \
"Add doc-store: client-side IndexedDB storage for draft and cached proofs" \
'const DB_NAME = "proofleger";
const DB_VERSION = 1;
const STORE_DRAFTS = "drafts";
const STORE_CACHE = "proof_cache";

function openDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains(STORE_DRAFTS)) db.createObjectStore(STORE_DRAFTS, { keyPath: "id" });
      if (!db.objectStoreNames.contains(STORE_CACHE)) db.createObjectStore(STORE_CACHE, { keyPath: "hash" });
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export async function saveDraft(draft) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_DRAFTS, "readwrite");
    tx.objectStore(STORE_DRAFTS).put({ ...draft, id: "current", savedAt: Date.now() });
    tx.oncomplete = resolve; tx.onerror = reject;
  });
}

export async function getDraft() {
  const db = await openDB();
  return new Promise((resolve) => {
    const tx = db.transaction(STORE_DRAFTS, "readonly");
    const req = tx.objectStore(STORE_DRAFTS).get("current");
    req.onsuccess = () => resolve(req.result || null);
    req.onerror = () => resolve(null);
  });
}

export async function cacheProof(hash, data) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_CACHE, "readwrite");
    tx.objectStore(STORE_CACHE).put({ hash, data, cachedAt: Date.now() });
    tx.oncomplete = resolve; tx.onerror = reject;
  });
}

export async function getCachedProof(hash) {
  const db = await openDB();
  return new Promise((resolve) => {
    const tx = db.transaction(STORE_CACHE, "readonly");
    const req = tx.objectStore(STORE_CACHE).get(hash);
    req.onsuccess = () => {
      const result = req.result;
      if (!result) return resolve(null);
      const age = Date.now() - result.cachedAt;
      if (age > 5 * 60 * 1000) return resolve(null); // 5 min TTL
      resolve(result.data);
    };
    req.onerror = () => resolve(null);
  });
}'

# ── Docs ──────────────────────────────────────────────────────

c docs/contexts.md \
"Add contexts docs: React context providers and global state" \
'# ProofLedger Context Providers

## WalletContext

```jsx
import { WalletProvider, useWalletContext } from "@/context/WalletContext";

// Wrap your app
<WalletProvider>
  <App />
</WalletProvider>

// Use anywhere
const { address, connectWallet, disconnectWallet, isConnected } = useWalletContext();
```

## NetworkContext

```jsx
import { NetworkProvider, useNetworkContext } from "@/context/NetworkContext";

const { network, switchNetwork, isStacks, isCelo } = useNetworkContext();
switchNetwork("celo"); // or "stacks"
```

## ProofContext

```jsx
import { ProofProvider, useProofContext } from "@/context/ProofContext";

const { draft, updateDraft, clearDraft, recentProofs } = useProofContext();
updateDraft({ hash: "a1b2...", title: "My Diploma" });
```'

c docs/hooks-complete.md \
"Add complete hooks reference: all 30+ hooks with signatures" \
'# Complete Hooks Reference

## Wallet
- `useWalletContext()` — global wallet state
- `useMiniPaySession()` — MiniPay auto-connect
- `useCeloBalance(addr)` — CELO balance
- `useCeloDocCount(addr)` — Celo document count
- `useCeloGas()` — gas price estimation

## Documents
- `useAnchor()` — anchor to Stacks
- `useVerify()` — verify on Stacks
- `useAttest()` — attest document
- `useHash()` — SHA-256 hash
- `useCeloAnchor()` — anchor to Celo
- `useCeloVerify()` — verify on Celo
- `useContractCall(fn)` — generic read-only call
- `useMultiChain(network)` — unified multi-chain
- `useProfile(address)` — complete profile
- `useRecords(address)` — transaction history
- `useTransactionStatus(txId)` — TX polling

## UI
- `useSearch(items, keys)` — client-side search
- `usePagination(items, pageSize)` — pagination
- `useForm(values, validators)` — form state
- `useClipboard(timeout)` — copy to clipboard
- `useNotifications()` — notification queue
- `useReputation()` — score calculation

## Utilities
- `useDebounce(value, delay)` — debounce
- `useLocalStorage(key, init)` — persisted state
- `useNetwork()` — Stacks block height
- `useMediaQuery(query)` — CSS media query
- `useIsMobile()` — mobile breakpoint
- `useScrollPosition()` — scroll tracking
- `useIntersection()` — visibility detection
- `useWindowSize()` — window dimensions
- `useKeyboard(shortcuts)` — keyboard shortcuts
- `useFocus()` — focus state
- `usePrevious(value)` — previous value
- `useInterval(fn, delay)` — safe interval
- `useTimeout(fn, delay)` — safe timeout
- `useCeloEvents()` — Celo event listener'

echo -e "${YELLOW}Pushing...${NC}"
git push origin main -q
echo -e "${GREEN}Done! $TOTAL commits${NC}"
