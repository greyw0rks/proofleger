#!/bin/bash
# ProofLedger App - Daily Commits April 14
# cd proofleger && bash daily_app_apr14.sh

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

echo -e "${YELLOW}Daily commits Apr 14 starting...${NC}"

# ── Notification system ───────────────────────────────────────

c src/lib/notifications.js \
"Add notifications lib: in-app notification queue management" \
'const queue = [];
let listeners = [];

export function addNotification(msg, type = "info", duration = 4000) {
  const note = { id: Date.now() + Math.random(), msg, type, duration };
  queue.push(note);
  listeners.forEach(l => l([...queue]));
  setTimeout(() => removeNotification(note.id), duration);
  return note.id;
}

export function removeNotification(id) {
  const idx = queue.findIndex(n => n.id === id);
  if (idx > -1) { queue.splice(idx, 1); listeners.forEach(l => l([...queue])); }
}

export function subscribeNotifications(fn) {
  listeners.push(fn);
  return () => { listeners = listeners.filter(l => l !== fn); };
}

export const notify = {
  success: (msg) => addNotification(msg, "success"),
  error:   (msg) => addNotification(msg, "error"),
  info:    (msg) => addNotification(msg, "info"),
  warn:    (msg) => addNotification(msg, "warn"),
};'

c src/hooks/useNotifications.js \
"Add useNotifications hook: subscribe to global notification queue" \
'"use client";
import { useState, useEffect } from "react";
import { subscribeNotifications, removeNotification } from "@/lib/notifications";

export function useNotifications() {
  const [notes, setNotes] = useState([]);
  useEffect(() => subscribeNotifications(setNotes), []);
  return { notes, dismiss: removeNotification };
}'

c src/components/NotificationStack.jsx \
"Add NotificationStack: renders global notification toasts" \
'"use client";
import { useNotifications } from "@/hooks/useNotifications";

const TYPE_COLORS = {
  success: "#00ff88",
  error:   "#ff3333",
  warn:    "#F7931A",
  info:    "#f5f0e8",
};

export default function NotificationStack() {
  const { notes, dismiss } = useNotifications();
  if (notes.length === 0) return null;
  return (
    <div style={{ position:"fixed", bottom:24, right:24, zIndex:9999, display:"flex", flexDirection:"column", gap:8 }}>
      {notes.map(n => {
        const color = TYPE_COLORS[n.type] || TYPE_COLORS.info;
        return (
          <div key={n.id} onClick={() => dismiss(n.id)}
            style={{ border:`3px solid ${color}`, background:"#0a0a0a", color, padding:"12px 20px",
              fontFamily:"Space Grotesk, sans-serif", fontSize:13, boxShadow:`4px 4px 0 ${color}`,
              cursor:"pointer", maxWidth:360, animation:"slideIn 0.2s ease" }}>
            {n.msg}
          </div>
        );
      })}
      <style>{`@keyframes slideIn{from{transform:translateX(100%);opacity:0}to{transform:none;opacity:1}}`}</style>
    </div>
  );
}'

c src/hooks/useIntersection.js \
"Add useIntersection hook: detect element visibility for lazy loading" \
'"use client";
import { useState, useEffect, useRef } from "react";

export function useIntersection(options = {}) {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => {
      setIsVisible(entry.isIntersecting);
    }, { threshold: 0.1, ...options });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return [ref, isVisible];
}'

c src/hooks/useWindowSize.js \
"Add useWindowSize hook: track browser window dimensions reactively" \
'"use client";
import { useState, useEffect } from "react";

export function useWindowSize() {
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    function update() {
      setSize({ width: window.innerWidth, height: window.innerHeight });
    }
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return size;
}'

c src/hooks/usePrevious.js \
"Add usePrevious hook: track previous value of any state or prop" \
'"use client";
import { useRef, useEffect } from "react";

export function usePrevious(value) {
  const ref = useRef(undefined);
  useEffect(() => { ref.current = value; }, [value]);
  return ref.current;
}'

bump "0.3.1"

# ── Search and filtering ──────────────────────────────────────

c src/hooks/useSearch.js \
"Add useSearch hook: client-side search and filter for proof records" \
'"use client";
import { useState, useMemo } from "react";

export function useSearch(items = [], keys = []) {
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState({});

  const results = useMemo(() => {
    let out = [...items];
    if (query.trim()) {
      const q = query.toLowerCase();
      out = out.filter(item =>
        keys.some(key => String(item[key] || "").toLowerCase().includes(q))
      );
    }
    Object.entries(filters).forEach(([key, val]) => {
      if (val) out = out.filter(item => item[key] === val);
    });
    return out;
  }, [items, query, filters, keys]);

  return {
    query, setQuery,
    filters, setFilter: (k, v) => setFilters(f => ({ ...f, [k]: v })),
    clearFilters: () => setFilters({}),
    results,
    count: results.length,
  };
}'

c src/components/SearchBar.jsx \
"Add SearchBar: document search input with debounce and clear button" \
'"use client";
import { useDebounce } from "@/hooks/useDebounce";
import { useState, useEffect } from "react";

export default function SearchBar({ onSearch, placeholder = "Search documents..." }) {
  const [value, setValue] = useState("");
  const debounced = useDebounce(value, 300);

  useEffect(() => { onSearch?.(debounced); }, [debounced]);

  return (
    <div style={{ position:"relative", marginBottom:16 }}>
      <input
        value={value}
        onChange={e => setValue(e.target.value)}
        placeholder={placeholder}
        style={{ width:"100%", background:"transparent", border:"3px solid #333", color:"#f5f0e8",
          padding:"12px 40px 12px 16px", fontFamily:"Space Grotesk, sans-serif", fontSize:14,
          outline:"none", boxSizing:"border-box" }}
        onFocus={e => e.target.style.borderColor="#F7931A"}
        onBlur={e => e.target.style.borderColor="#333"}
      />
      {value && (
        <button onClick={() => setValue("")}
          style={{ position:"absolute", right:12, top:"50%", transform:"translateY(-50%)",
            background:"none", border:"none", color:"#666", cursor:"pointer", fontSize:16, lineHeight:1 }}>
          ×
        </button>
      )}
    </div>
  );
}'

c src/components/FilterBar.jsx \
"Add FilterBar: document type and network filter pills" \
'"use client";
const DOC_TYPES = ["all","diploma","certificate","research","art","contribution","award","other"];

export default function FilterBar({ activeType, onTypeChange, activeNetwork, onNetworkChange }) {
  return (
    <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginBottom:20 }}>
      {DOC_TYPES.map(t => (
        <button key={t} onClick={() => onTypeChange?.(t === "all" ? null : t)}
          style={{ border:`2px solid ${activeType === t || (!activeType && t === "all") ? "#F7931A" : "#333"}`,
            background: activeType === t || (!activeType && t === "all") ? "#F7931A" : "transparent",
            color: activeType === t || (!activeType && t === "all") ? "#000" : "#888",
            padding:"4px 12px", fontFamily:"Archivo Black, sans-serif", fontSize:10,
            cursor:"pointer", letterSpacing:"0.5px" }}>
          {t.toUpperCase()}
        </button>
      ))}
      <div style={{ width:1, background:"#222", margin:"0 4px" }} />
      {["stacks","celo"].map(n => (
        <button key={n} onClick={() => onNetworkChange?.(n === activeNetwork ? null : n)}
          style={{ border:`2px solid ${activeNetwork === n ? (n==="celo"?"#35D07F":"#F7931A") : "#333"}`,
            background: activeNetwork === n ? (n==="celo"?"#35D07F":"#F7931A") : "transparent",
            color: activeNetwork === n ? "#000" : "#888",
            padding:"4px 12px", fontFamily:"Archivo Black, sans-serif", fontSize:10, cursor:"pointer" }}>
          {n.toUpperCase()}
        </button>
      ))}
    </div>
  );
}'

c src/components/SortSelector.jsx \
"Add SortSelector: sort proof records by date, type, or attestations" \
'"use client";
const OPTIONS = [
  { value:"newest", label:"Newest First" },
  { value:"oldest", label:"Oldest First" },
  { value:"attestations", label:"Most Attested" },
  { value:"type", label:"By Type" },
];

export default function SortSelector({ value = "newest", onChange }) {
  return (
    <select value={value} onChange={e => onChange?.(e.target.value)}
      style={{ background:"#0a0a0a", border:"3px solid #333", color:"#f5f0e8",
        padding:"8px 12px", fontFamily:"Space Grotesk, sans-serif", fontSize:13,
        cursor:"pointer", outline:"none" }}
      onFocus={e => e.target.style.borderColor="#F7931A"}
      onBlur={e => e.target.style.borderColor="#333"}>
      {OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  );
}'

bump "0.3.2"

# ── Advanced profile features ─────────────────────────────────

c src/lib/profile-builder.js \
"Add profile-builder: assemble on-chain profile data from multiple sources" \
'import { getReputation } from "@/utils/reputation";

export async function buildProfile(address) {
  const API = "https://api.hiro.so";
  const C = "SP1SY1E599GN04XRD2DQBKV7E62HYBJR2CT9S5QKK";

  const [balRes, txRes, nftRes] = await Promise.allSettled([
    fetch(`${API}/v2/accounts/${address}?proof=0`).then(r => r.json()),
    fetch(`${API}/extended/v1/address/${address}/transactions?limit=50`).then(r => r.json()),
    fetch(`${API}/extended/v1/tokens/nft/holdings?principal=${address}&asset_identifiers=${C}.achievements::achievement`).then(r => r.json()),
  ]);

  const balance = balRes.status === "fulfilled" ? Number(balRes.value?.balance || 0) / 1e6 : 0;
  const txs = txRes.status === "fulfilled" ? txRes.value?.results || [] : [];
  const nfts = nftRes.status === "fulfilled" ? nftRes.value?.results || [] : [];

  const anchors = txs.filter(t => t.tx_status === "success" && t.contract_call?.function_name?.includes("store"));
  const attests = txs.filter(t => t.tx_status === "success" && t.contract_call?.function_name?.includes("attest"));

  const docs = anchors.map(t => ({ docType: "other", attestations: 0, hasNFT: false }));
  const reputation = getReputation(docs);

  return { address, balance, anchors: anchors.length, attests: attests.length, nfts: nfts.length, reputation, totalTxs: txs.length };
}'

c src/hooks/useProfile.js \
"Add useProfile hook: fetch and cache complete wallet proof profile" \
'"use client";
import { useState, useEffect, useCallback } from "react";
import { buildProfile } from "@/lib/profile-builder";

export function useProfile(address) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetch_ = useCallback(async () => {
    if (!address) return;
    setLoading(true); setError(null);
    try {
      const data = await buildProfile(address);
      setProfile(data);
    } catch(e) { setError(e.message); }
    finally { setLoading(false); }
  }, [address]);

  useEffect(() => { fetch_(); }, [fetch_]);

  return { profile, loading, error, refetch: fetch_ };
}'

c src/components/ProfileHeader.jsx \
"Add ProfileHeader: wallet profile header with avatar, name, and reputation" \
'"use client";
import ReputationBadge from "./ReputationBadge";
import WalletAddress from "./WalletAddress";

export default function ProfileHeader({ address, displayName, score = 0, docCount = 0, isOwner = false }) {
  const initials = displayName ? displayName.slice(0, 2).toUpperCase() : address?.slice(2, 4).toUpperCase();
  return (
    <div style={{ display:"flex", alignItems:"center", gap:20, marginBottom:32, paddingBottom:24, borderBottom:"3px solid #222" }}>
      <div style={{ width:64, height:64, background:"#F7931A", display:"flex", alignItems:"center", justifyContent:"center",
        fontFamily:"Archivo Black, sans-serif", fontSize:24, color:"#000", flexShrink:0 }}>
        {initials}
      </div>
      <div style={{ flex:1 }}>
        {displayName && <div style={{ fontFamily:"Archivo Black, sans-serif", fontSize:22, color:"#f5f0e8", marginBottom:4 }}>{displayName}</div>}
        <WalletAddress address={address} />
        <div style={{ marginTop:8, display:"flex", alignItems:"center", gap:12 }}>
          <ReputationBadge score={score} size="sm" />
          <span style={{ fontFamily:"Space Mono, monospace", fontSize:11, color:"#666" }}>{docCount} proof{docCount!==1?"s":""}</span>
        </div>
      </div>
      {isOwner && (
        <a href="/profile/edit" style={{ border:"2px solid #333", color:"#666", padding:"6px 14px",
          fontFamily:"Archivo Black, sans-serif", fontSize:10, textDecoration:"none", letterSpacing:1 }}>
          EDIT
        </a>
      )}
    </div>
  );
}'

c src/components/CVSection.jsx \
"Add CVSection: reusable section block for decentralized CV page" \
'"use client";
export default function CVSection({ title, children, accent = "#F7931A", printable = true }) {
  return (
    <div style={{ marginBottom:32, ...(printable ? {} : { pageBreakInside:"avoid" }) }}>
      <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:16 }}>
        <div style={{ width:4, height:24, background:accent, flexShrink:0 }} />
        <h2 style={{ fontFamily:"Archivo Black, sans-serif", fontSize:16, color:accent, margin:0, letterSpacing:2 }}>
          {title.toUpperCase()}
        </h2>
        <div style={{ flex:1, height:1, background:"#222" }} />
      </div>
      {children}
    </div>
  );
}'

bump "0.3.3"

# ── Performance improvements ──────────────────────────────────

c src/lib/rate-limiter.js \
"Add rate-limiter: client-side request throttling for Hiro API" \
'const queues = new Map();

export function rateLimit(key, fn, intervalMs = 1000) {
  if (!queues.has(key)) queues.set(key, { last: 0, pending: [] });
  const q = queues.get(key);

  return new Promise((resolve, reject) => {
    q.pending.push({ fn, resolve, reject });
    processQueue(key, intervalMs);
  });
}

async function processQueue(key, intervalMs) {
  const q = queues.get(key);
  if (!q || q.processing) return;
  q.processing = true;

  while (q.pending.length > 0) {
    const now = Date.now();
    const wait = Math.max(0, q.last + intervalMs - now);
    if (wait > 0) await new Promise(r => setTimeout(r, wait));

    const { fn, resolve, reject } = q.pending.shift();
    q.last = Date.now();
    try { resolve(await fn()); } catch(e) { reject(e); }
  }

  q.processing = false;
}'

c src/lib/retry.js \
"Add retry lib: exponential backoff retry for failed API calls" \
'export async function withRetry(fn, options = {}) {
  const { maxAttempts = 3, baseDelay = 1000, onError } = options;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch(e) {
      if (attempt === maxAttempts) throw e;
      onError?.(e, attempt);
      const delay = baseDelay * Math.pow(2, attempt - 1) + Math.random() * 500;
      await new Promise(r => setTimeout(r, delay));
    }
  }
}

export async function withTimeout(fn, ms = 10000) {
  return Promise.race([
    fn(),
    new Promise((_, reject) => setTimeout(() => reject(new Error(`Timeout after ${ms}ms`)), ms)),
  ]);
}'

c src/utils/performance.js \
"Add performance utils: memoization and lazy initialization helpers" \
'export function memoize(fn) {
  const cache = new Map();
  return function(...args) {
    const key = JSON.stringify(args);
    if (cache.has(key)) return cache.get(key);
    const result = fn.apply(this, args);
    cache.set(key, result);
    return result;
  };
}

export function lazy(fn) {
  let value;
  let initialized = false;
  return () => {
    if (!initialized) { value = fn(); initialized = true; }
    return value;
  };
}

export function throttle(fn, ms) {
  let last = 0;
  return function(...args) {
    const now = Date.now();
    if (now - last >= ms) { last = now; return fn.apply(this, args); }
  };
}

export function debounce(fn, ms) {
  let timer;
  return function(...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), ms);
  };
}'

c src/utils/color.js \
"Add color utils: hex manipulation and opacity helpers for dynamic theming" \
'export function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16),
  } : null;
}

export function withOpacity(hex, opacity) {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;
  return `rgba(${rgb.r},${rgb.g},${rgb.b},${opacity})`;
}

export const THEME = {
  black:   "#0a0a0a",
  white:   "#f5f0e8",
  orange:  "#F7931A",
  green:   "#00ff88",
  red:     "#ff3333",
  purple:  "#a78bfa",
  blue:    "#38bdf8",
  celoGreen: "#35D07F",
  celoYellow: "#FCFF52",
};'

bump "0.3.4"

# ── Docs ──────────────────────────────────────────────────────

c docs/hooks-advanced.md \
"Add advanced hooks docs: search, notifications, profile, performance" \
'# Advanced React Hooks

## Search and Filter

```javascript
import { useSearch } from "@/hooks/useSearch";

const { query, setQuery, filters, setFilter, results } = useSearch(
  documents,
  ["title", "docType"]
);
```

## Notifications

```javascript
import { notify } from "@/lib/notifications";

notify.success("Document anchored to Bitcoin!");
notify.error("Transaction failed");
```

## Profile

```javascript
import { useProfile } from "@/hooks/useProfile";

const { profile, loading } = useProfile("SP1SY1...");
// profile.anchors, profile.reputation, profile.nfts
```

## Performance

```javascript
import { useIntersection } from "@/hooks/useIntersection";

const [ref, isVisible] = useIntersection();
// Lazy-load content when element enters viewport
```'

c docs/performance.md \
"Add performance docs: caching, rate limiting, and retry strategies" \
'# ProofLedger Performance Guide

## Rate Limiting

The Hiro API free tier allows ~1 request/second.
Use the built-in rate limiter for batched operations:

```javascript
import { rateLimit } from "@/lib/rate-limiter";

const result = await rateLimit("hiro-api", () =>
  fetch("https://api.hiro.so/v2/accounts/SP...?proof=0")
);
```

## Caching

Use the cache lib to avoid repeat API calls:

```javascript
import { cacheWrap } from "@/lib/cache";

const profile = await cacheWrap(
  `profile:${address}`,
  () => buildProfile(address),
  60_000  // cache for 60 seconds
);
```

## Retry Logic

```javascript
import { withRetry } from "@/lib/retry";

const data = await withRetry(
  () => fetch("https://api.hiro.so/...").then(r => r.json()),
  { maxAttempts: 3, baseDelay: 1000 }
);
```

## Best Practices

- Always add 500ms delay between balance checks
- Use `?unanchored=true` for nonce queries
- Cache read-only contract calls for 60s
- Batch verify multiple hashes in one POST to `/api/verify`'

c docs/theming.md \
"Add theming docs: color system, fonts, and neo-brutalist design tokens" \
'# ProofLedger Design System

## Colors

```javascript
import { THEME } from "@/utils/color";

THEME.black      // #0a0a0a  — background
THEME.white      // #f5f0e8  — foreground (warm white)
THEME.orange     // #F7931A  — Bitcoin orange, primary accent
THEME.green      // #00ff88  — success, verified state
THEME.red        // #ff3333  — error state
THEME.celoGreen  // #35D07F  — Celo network accent
```

## Typography

```css
font-family: "Archivo Black"  /* headings, labels */
font-family: "Space Grotesk"  /* body text */
font-family: "Space Mono"     /* monospace, hashes, addresses */
```

## Neo-Brutalist Borders

```css
border: 3px solid #f5f0e8;
box-shadow: 6px 6px 0px #f5f0e8;  /* standard shadow */
box-shadow: 6px 6px 0px #F7931A;  /* orange shadow */
```

## Component Patterns

- Buttons: translate on hover/active, hard box-shadow
- Cards: 3px border + 6px offset shadow
- Tags: 2px border, no radius
- Inputs: 3px border, transparent background, orange focus'

bump "0.4.0"

echo -e "${YELLOW}Pushing...${NC}"
git push origin main -q
echo -e "${GREEN}Done! $TOTAL commits. Version 0.4.0${NC}"
