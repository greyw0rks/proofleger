"use client";
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
}