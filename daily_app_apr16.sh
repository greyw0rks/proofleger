#!/bin/bash
# ProofLedger App - Daily Commits April 16
# cd proofleger && bash daily_app_apr16.sh

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

echo -e "${YELLOW}Daily commits Apr 16 starting...${NC}"

# ── Accessibility improvements ────────────────────────────────

c src/hooks/useKeyboard.js \
"Add useKeyboard hook: global keyboard shortcut handler" \
'"use client";
import { useEffect, useCallback } from "react";

export function useKeyboard(shortcuts) {
  const handle = useCallback((e) => {
    const key = [
      e.ctrlKey && "ctrl",
      e.metaKey && "meta",
      e.shiftKey && "shift",
      e.altKey && "alt",
      e.key.toLowerCase(),
    ].filter(Boolean).join("+");
    if (shortcuts[key]) {
      e.preventDefault();
      shortcuts[key](e);
    }
  }, [shortcuts]);

  useEffect(() => {
    window.addEventListener("keydown", handle);
    return () => window.removeEventListener("keydown", handle);
  }, [handle]);
}'

c src/hooks/useFocus.js \
"Add useFocus hook: track element focus state for accessibility" \
'"use client";
import { useState, useCallback, useRef } from "react";

export function useFocus() {
  const [focused, setFocused] = useState(false);
  const ref = useRef(null);
  const onFocus = useCallback(() => setFocused(true), []);
  const onBlur = useCallback(() => setFocused(false), []);
  return { ref, focused, onFocus, onBlur };
}'

c src/hooks/useMediaQuery.js \
"Add useMediaQuery hook: reactive CSS media query matching" \
'"use client";
import { useState, useEffect } from "react";

export function useMediaQuery(query) {
  const [matches, setMatches] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(query);
    setMatches(mq.matches);
    const handler = (e) => setMatches(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [query]);
  return matches;
}

export const useIsMobile = () => useMediaQuery("(max-width: 768px)");
export const useIsTablet = () => useMediaQuery("(max-width: 1024px)");
export const useIsDark = () => useMediaQuery("(prefers-color-scheme: dark)");'

c src/hooks/useScrollPosition.js \
"Add useScrollPosition hook: track page scroll for sticky nav effects" \
'"use client";
import { useState, useEffect } from "react";

export function useScrollPosition() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [direction, setDirection] = useState("up");

  useEffect(() => {
    let lastY = window.scrollY;
    function update() {
      const y = window.scrollY;
      setDirection(y > lastY ? "down" : "up");
      setPosition({ x: window.scrollX, y });
      lastY = y;
    }
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  return { ...position, direction, isScrolled: position.y > 50 };
}'

c src/components/Navbar.jsx \
"Add Navbar: responsive top navigation with scroll-aware styling" \
'"use client";
import { useScrollPosition } from "@/hooks/useScrollPosition";
import { useIsMobile } from "@/hooks/useMediaQuery";

const LINKS = [
  { href:"/explore",    label:"EXPLORE" },
  { href:"/leaderboard",label:"LEADERBOARD" },
  { href:"/stats",      label:"STATS" },
  { href:"/faq",        label:"FAQ" },
];

export default function Navbar({ address }) {
  const { isScrolled } = useScrollPosition();
  const isMobile = useIsMobile();
  return (
    <nav style={{ position:"sticky", top:0, zIndex:100, padding:"12px 24px",
      background: isScrolled ? "rgba(10,10,10,0.95)" : "transparent",
      backdropFilter: isScrolled ? "blur(8px)" : "none",
      borderBottom: isScrolled ? "2px solid #1a1a1a" : "none",
      display:"flex", alignItems:"center", justifyContent:"space-between",
      transition:"all 0.2s" }}>
      <a href="/" style={{ fontFamily:"Archivo Black, sans-serif", fontSize:16,
        color:"#F7931A", textDecoration:"none", letterSpacing:1 }}>
        PROOF<span style={{ color:"#f5f0e8" }}>LEDGER</span>
      </a>
      {!isMobile && (
        <div style={{ display:"flex", gap:24 }}>
          {LINKS.map(l => (
            <a key={l.href} href={l.href}
              style={{ fontFamily:"Archivo Black, sans-serif", fontSize:11,
                color:"#666", textDecoration:"none", letterSpacing:1 }}
              onMouseOver={e => e.target.style.color="#f5f0e8"}
              onMouseOut={e => e.target.style.color="#666"}>
              {l.label}
            </a>
          ))}
        </div>
      )}
      {address && (
        <div style={{ fontFamily:"Space Mono, monospace", fontSize:10, color:"#555" }}>
          {address.slice(0,6)}...{address.slice(-4)}
        </div>
      )}
    </nav>
  );
}'

c src/components/Footer.jsx \
"Add Footer: site footer with links, network status, and version" \
'"use client";
import { useNetwork } from "@/hooks/useNetwork";

export default function Footer() {
  const { blockHeight } = useNetwork();
  return (
    <footer style={{ borderTop:"3px solid #1a1a1a", padding:"32px 24px",
      fontFamily:"Space Grotesk, sans-serif" }}>
      <div style={{ maxWidth:960, margin:"0 auto",
        display:"flex", justifyContent:"space-between", flexWrap:"wrap", gap:16 }}>
        <div>
          <div style={{ fontFamily:"Archivo Black, sans-serif", fontSize:14,
            color:"#F7931A", marginBottom:8 }}>PROOFLEGER</div>
          <div style={{ fontSize:12, color:"#555", maxWidth:260, lineHeight:1.6 }}>
            Anchor documents to Bitcoin permanently. Built on Stacks and Celo.
          </div>
        </div>
        <div style={{ display:"flex", gap:32 }}>
          {[
            { title:"PROTOCOL", links:[["Explore","/explore"],["Stats","/stats"],["FAQ","/faq"]] },
            { title:"DEVELOPERS", links:[["SDK","https://npmjs.com/package/proofleger-sdk"],["Contracts","https://github.com/greyw0rks/proofleger-contracts"],["GitHub","https://github.com/greyw0rks/proofleger"]] },
          ].map((col,i) => (
            <div key={i}>
              <div style={{ fontFamily:"Archivo Black, sans-serif", fontSize:10,
                color:"#444", marginBottom:10, letterSpacing:1 }}>{col.title}</div>
              {col.links.map(([label,href]) => (
                <a key={label} href={href} target={href.startsWith("http")?"_blank":"_self"} rel="noreferrer"
                  style={{ display:"block", fontSize:12, color:"#555", textDecoration:"none", marginBottom:6 }}
                  onMouseOver={e => e.target.style.color="#f5f0e8"}
                  onMouseOut={e => e.target.style.color="#555"}>
                  {label}
                </a>
              ))}
            </div>
          ))}
        </div>
        <div style={{ width:"100%", borderTop:"1px solid #1a1a1a", paddingTop:16,
          display:"flex", justifyContent:"space-between", fontSize:10,
          fontFamily:"Space Mono, monospace", color:"#444" }}>
          <span>© 2026 greyw0rks · MIT License</span>
          {blockHeight && <span>Bitcoin Block #{Number(blockHeight).toLocaleString()}</span>}
        </div>
      </div>
    </footer>
  );
}'

c src/components/Modal.jsx \
"Add Modal: accessible dialog modal with backdrop and keyboard close" \
'"use client";
import { useEffect } from "react";
import { useKeyboard } from "@/hooks/useKeyboard";

export default function Modal({ open, onClose, title, children, maxWidth = 560 }) {
  useKeyboard({ "escape": onClose });
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  if (!open) return null;
  return (
    <div onClick={onClose}
      style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.8)",
        display:"flex", alignItems:"center", justifyContent:"center",
        zIndex:1000, padding:24 }}>
      <div onClick={e => e.stopPropagation()}
        style={{ background:"#0a0a0a", border:"3px solid #f5f0e8",
          boxShadow:"8px 8px 0 #f5f0e8", width:"100%", maxWidth,
          padding:28, position:"relative" }}>
        <div style={{ display:"flex", justifyContent:"space-between",
          alignItems:"center", marginBottom:20 }}>
          {title && <div style={{ fontFamily:"Archivo Black, sans-serif",
            fontSize:18, color:"#f5f0e8" }}>{title}</div>}
          <button onClick={onClose}
            style={{ background:"none", border:"none", color:"#666",
              cursor:"pointer", fontSize:20, lineHeight:1, marginLeft:"auto" }}>×</button>
        </div>
        {children}
      </div>
    </div>
  );
}'

c src/components/Tooltip.jsx \
"Add Tooltip: hover tooltip for contextual help text" \
'"use client";
import { useState } from "react";

export default function Tooltip({ text, children, position = "top" }) {
  const [visible, setVisible] = useState(false);
  const offset = { top:{ bottom:"calc(100% + 6px)", left:"50%", transform:"translateX(-50%)" },
    bottom:{ top:"calc(100% + 6px)", left:"50%", transform:"translateX(-50%)" },
    left:{ right:"calc(100% + 6px)", top:"50%", transform:"translateY(-50%)" },
    right:{ left:"calc(100% + 6px)", top:"50%", transform:"translateY(-50%)" } };
  return (
    <span style={{ position:"relative", display:"inline-block" }}
      onMouseEnter={() => setVisible(true)} onMouseLeave={() => setVisible(false)}>
      {children}
      {visible && (
        <span style={{ position:"absolute", ...offset[position], background:"#1a1a1a",
          border:"2px solid #333", color:"#f5f0e8", padding:"4px 10px", whiteSpace:"nowrap",
          fontFamily:"Space Grotesk, sans-serif", fontSize:11, pointerEvents:"none", zIndex:50 }}>
          {text}
        </span>
      )}
    </span>
  );
}'

c src/components/Accordion.jsx \
"Add Accordion: collapsible content sections for FAQ and docs" \
'"use client";
import { useState } from "react";

export function AccordionItem({ title, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div style={{ borderBottom:"2px solid #1a1a1a" }}>
      <button onClick={() => setOpen(o => !o)}
        style={{ width:"100%", background:"none", border:"none", padding:"16px 0",
          display:"flex", justifyContent:"space-between", alignItems:"center",
          cursor:"pointer", textAlign:"left" }}>
        <span style={{ fontFamily:"Archivo Black, sans-serif", fontSize:14,
          color:"#f5f0e8" }}>{title}</span>
        <span style={{ color:"#F7931A", fontSize:18, fontFamily:"Space Mono, monospace",
          transition:"transform 0.2s", transform: open ? "rotate(45deg)" : "none" }}>+</span>
      </button>
      {open && (
        <div style={{ paddingBottom:16, fontFamily:"Space Grotesk, sans-serif",
          fontSize:13, color:"#888", lineHeight:1.7 }}>
          {children}
        </div>
      )}
    </div>
  );
}

export default function Accordion({ items }) {
  return (
    <div>
      {items.map((item, i) => (
        <AccordionItem key={i} title={item.question}>{item.answer}</AccordionItem>
      ))}
    </div>
  );
}'

c src/components/Badge.jsx \
"Add Badge: small status badge with color variants" \
'"use client";
const VARIANTS = {
  success: { bg:"#0d1f16", border:"#00ff88", color:"#00ff88" },
  error:   { bg:"#1f0d0d", border:"#ff3333", color:"#ff3333" },
  warning: { bg:"#1f1500", border:"#F7931A", color:"#F7931A" },
  info:    { bg:"#0d0d1f", border:"#38bdf8", color:"#38bdf8" },
  neutral: { bg:"#111",    border:"#444",    color:"#888" },
};

export default function Badge({ label, variant = "neutral", dot = false }) {
  const s = VARIANTS[variant] || VARIANTS.neutral;
  return (
    <span style={{ display:"inline-flex", alignItems:"center", gap:5,
      background: s.bg, border:`2px solid ${s.border}`, color: s.color,
      padding:"2px 8px", fontFamily:"Archivo Black, sans-serif",
      fontSize:9, letterSpacing:"0.5px" }}>
      {dot && <span style={{ width:5, height:5, borderRadius:"50%",
        background: s.color, display:"inline-block" }} />}
      {label}
    </span>
  );
}'

c src/utils/slugify.js \
"Add slugify util: convert document titles to URL-safe slugs" \
'export function slugify(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function unslugify(slug) {
  return slug.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase());
}

export function truncate(text, max = 50) {
  if (!text || text.length <= max) return text;
  return text.slice(0, max).trimEnd() + "...";
}'

c src/utils/download.js \
"Add download util: trigger file downloads from browser for proof exports" \
'export function downloadJSON(data, filename = "proof.json") {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  triggerDownload(blob, filename);
}

export function downloadText(text, filename = "proof.txt") {
  const blob = new Blob([text], { type: "text/plain" });
  triggerDownload(blob, filename);
}

export function downloadCSV(rows, filename = "proofs.csv") {
  if (!rows.length) return;
  const header = Object.keys(rows[0]).join(",");
  const body = rows.map(r => Object.values(r).map(v => `"${v}"`).join(",")).join("\n");
  const blob = new Blob([header + "\n" + body], { type: "text/csv" });
  triggerDownload(blob, filename);
}

function triggerDownload(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}'

c src/lib/export.js \
"Add export lib: generate shareable proof certificate data" \
'import { downloadJSON, downloadText } from "@/utils/download";

export function exportProofCertificate(proof) {
  const cert = {
    certificate: "ProofLedger Document Certificate",
    version: "1.0",
    issuedAt: new Date().toISOString(),
    document: {
      hash: proof.hash,
      title: proof.title,
      docType: proof.docType,
      owner: proof.owner,
    },
    blockchain: {
      network: proof.network || "Stacks Mainnet",
      blockHeight: proof.blockHeight,
      transactionId: proof.txId,
      anchored: true,
    },
    verifyUrl: `https://proofleger.vercel.app/verify?hash=${proof.hash}`,
    verifier: {
      contract: "SP1SY1E599GN04XRD2DQBKV7E62HYBJR2CT9S5QKK.proofleger3",
      explorer: `https://explorer.hiro.so/txid/${proof.txId}`,
    },
  };
  downloadJSON(cert, `proofleger-cert-${proof.hash.slice(0,8)}.json`);
  return cert;
}

export function exportProofText(proof) {
  const text = [
    "=".repeat(50),
    "PROOFLEGER DOCUMENT CERTIFICATE",
    "=".repeat(50),
    `Title:       ${proof.title}`,
    `Type:        ${proof.docType}`,
    `Hash:        ${proof.hash}`,
    `Owner:       ${proof.owner}`,
    `Block:       ${proof.blockHeight}`,
    `Network:     Stacks Mainnet → Bitcoin`,
    `Verify:      https://proofleger.vercel.app/verify?hash=${proof.hash}`,
    "=".repeat(50),
  ].join("\n");
  downloadText(text, `proofleger-cert-${proof.hash.slice(0,8)}.txt`);
  return text;
}'

c src/app/certificate/[hash]/page.js \
"Add certificate page: printable proof of existence certificate" \
'"use client";
import { useState, useEffect, use } from "react";
import { verifyDocument } from "@/lib/wallet";
import { exportProofCertificate, exportProofText } from "@/lib/export";

export default function CertificatePage({ params }) {
  const { hash } = use(params);
  const [proof, setProof] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    verifyDocument(hash)
      .then(r => { setProof(r); setLoading(false); })
      .catch(() => setLoading(false));
  }, [hash]);

  if (loading) return <div style={{ padding:40, color:"#666", fontFamily:"Space Mono, monospace" }}>Loading...</div>;
  if (!proof) return <div style={{ padding:40, color:"#ff3333", fontFamily:"Space Mono, monospace" }}>NOT FOUND</div>;

  return (
    <div style={{ maxWidth:680, margin:"40px auto", padding:"0 24px",
      fontFamily:"Space Grotesk, sans-serif", color:"#f5f0e8" }}>
      <div style={{ border:"4px solid #F7931A", padding:40, boxShadow:"8px 8px 0 #F7931A",
        background:"#0a0a0a" }}>
        <div style={{ textAlign:"center", marginBottom:32 }}>
          <div style={{ fontFamily:"Archivo Black, sans-serif", fontSize:11,
            color:"#F7931A", letterSpacing:4, marginBottom:12 }}>PROOFLEGER</div>
          <div style={{ fontFamily:"Archivo Black, sans-serif", fontSize:28,
            color:"#f5f0e8", marginBottom:4 }}>CERTIFICATE OF PROOF</div>
          <div style={{ fontSize:12, color:"#555" }}>Anchored to Bitcoin via Stacks</div>
        </div>
        <div style={{ borderTop:"2px solid #222", borderBottom:"2px solid #222",
          padding:"24px 0", marginBottom:24 }}>
          <div style={{ fontFamily:"Archivo Black, sans-serif", fontSize:20,
            color:"#f5f0e8", textAlign:"center", marginBottom:8 }}>
            {proof.title || "Untitled Document"}
          </div>
          <div style={{ textAlign:"center", color:"#888", fontSize:12 }}>
            {proof["doc-type"] || proof.docType}
          </div>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16,
          fontFamily:"Space Mono, monospace", fontSize:11, marginBottom:24 }}>
          {[["BLOCK HEIGHT", `#${proof["block-height"] || proof.blockHeight}`],
            ["NETWORK", "Stacks Mainnet"],
            ["OWNER", `${proof.owner?.slice(0,10)}...`],
            ["VERIFIED", "✓ ON BITCOIN"]].map(([k,v]) => (
            <div key={k}>
              <div style={{ color:"#555", marginBottom:4, fontSize:9, letterSpacing:1 }}>{k}</div>
              <div style={{ color:"#f5f0e8" }}>{v}</div>
            </div>
          ))}
        </div>
        <div style={{ fontFamily:"Space Mono, monospace", fontSize:9,
          color:"#444", wordBreak:"break-all", marginBottom:24 }}>
          HASH: {hash}
        </div>
        <div style={{ display:"flex", gap:8, justifyContent:"center" }}>
          <button onClick={() => exportProofCertificate({ ...proof, hash })}
            style={{ border:"2px solid #F7931A", background:"transparent",
              color:"#F7931A", padding:"8px 16px", fontFamily:"Archivo Black, sans-serif",
              fontSize:11, cursor:"pointer" }}>EXPORT JSON</button>
          <button onClick={() => exportProofText({ ...proof, hash })}
            style={{ border:"2px solid #f5f0e8", background:"transparent",
              color:"#f5f0e8", padding:"8px 16px", fontFamily:"Archivo Black, sans-serif",
              fontSize:11, cursor:"pointer" }}>EXPORT TXT</button>
          <button onClick={() => window.print()}
            style={{ border:"2px solid #00ff88", background:"transparent",
              color:"#00ff88", padding:"8px 16px", fontFamily:"Archivo Black, sans-serif",
              fontSize:11, cursor:"pointer" }}>PRINT</button>
        </div>
      </div>
    </div>
  );
}'

c docs/export.md \
"Add export docs: proof certificate generation and download formats" \
'# ProofLedger Export

Generate shareable proof certificates from any verified document.

## Certificate Page

Visit: `https://proofleger.vercel.app/certificate/{hash}`

Shows a printable certificate with:
- Document title and type
- Block height and network
- Owner address
- SHA-256 hash
- Export buttons

## Export Formats

### JSON Certificate
```javascript
import { exportProofCertificate } from "@/lib/export";
exportProofCertificate(proof);
// Downloads: proofleger-cert-{hash8}.json
```

### Text Certificate
```javascript
import { exportProofText } from "@/lib/export";
exportProofText(proof);
// Downloads: proofleger-cert-{hash8}.txt
```

### CSV (multiple proofs)
```javascript
import { downloadCSV } from "@/utils/download";
downloadCSV(proofs, "my-proofs.csv");
```

## Print

The certificate page includes a print button optimized for PDF export.'

echo -e "${YELLOW}Pushing...${NC}"
git push origin main -q
echo -e "${GREEN}Done! $TOTAL commits${NC}"
