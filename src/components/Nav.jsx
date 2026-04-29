"use client";
import Link          from "next/link";
import { usePathname } from "next/navigation";
import NetworkStatus from "./NetworkStatus";

const LINKS = [
  { href: "/anchor",      label: "ANCHOR"     },
  { href: "/verify",      label: "VERIFY"     },
  { href: "/search",      label: "SEARCH"     },
  { href: "/leaderboard", label: "LEADERBOARD"},
  { href: "/stats",       label: "STATS"      },
];

export default function Nav() {
  const pathname = usePathname();

  return (
    <nav style={{ borderBottom: "2px solid #111",
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "0 24px", height: 52, background: "#0a0a0a",
      position: "sticky", top: 0, zIndex: 100 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
        <Link href="/" style={{ textDecoration: "none" }}>
          <span style={{ fontFamily: "Archivo Black, sans-serif",
            fontSize: 14, color: "#f5f0e8", letterSpacing: 1 }}>
            PROOF<span style={{ color: "#F7931A" }}>LEDGER</span>
          </span>
        </Link>
        <div style={{ display: "flex", gap: 2, alignItems: "center" }}>
          {LINKS.map(({ href, label }) => (
            <Link key={href} href={href}
              style={{ textDecoration: "none",
                fontFamily: "Archivo Black, sans-serif", fontSize: 9,
                color: pathname === href ? "#F7931A" : "#555",
                letterSpacing: 1, padding: "4px 10px",
                borderBottom: pathname === href ? "2px solid #F7931A" : "2px solid transparent" }}>
              {label}
            </Link>
          ))}
        </div>
      </div>
      <NetworkStatus />
    </nav>
  );
}