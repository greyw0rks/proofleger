"use client";
import ProtocolStats  from "@/components/ProtocolStats";
import ActivityFeed   from "@/components/ActivityFeed";
import GlowButton     from "@/components/GlowButton";
import StatsStrip     from "@/components/StatsStrip";
import { useRouter }  from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  return (
    <div style={{ fontFamily: "Space Grotesk, sans-serif",
      color: "#f5f0e8", minHeight: "100vh", background: "#0a0a0a" }}>
      <StatsStrip />

      {/* Hero */}
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "64px 24px 40px" }}>
        <div style={{ marginBottom: 8, fontFamily: "Space Mono, monospace",
          fontSize: 9, color: "#555", letterSpacing: 3 }}>
          MULTI-CHAIN DOCUMENT ANCHORING
        </div>
        <h1 style={{ fontFamily: "Archivo Black, sans-serif",
          fontSize: "clamp(32px, 6vw, 56px)", lineHeight: 1.05,
          color: "#f5f0e8", marginBottom: 16 }}>
          PROOF<span style={{ color: "#F7931A" }}>LEDGER</span>
        </h1>
        <p style={{ color: "#666", fontSize: 14, maxWidth: 480,
          lineHeight: 1.6, marginBottom: 32 }}>
          Anchor any document hash permanently on Stacks and Celo.
          Verify authenticity on-chain — no trusted third party required.
        </p>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <GlowButton size="lg" onClick={() => router.push("/anchor")}>
            ANCHOR A DOCUMENT
          </GlowButton>
          <GlowButton size="lg" color="#888" onClick={() => router.push("/verify")}>
            VERIFY A HASH
          </GlowButton>
        </div>
      </div>

      {/* Stats grid */}
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "0 24px 40px" }}>
        <ProtocolStats />
      </div>

      {/* Activity */}
      <div style={{ maxWidth: 720, margin: "0 auto",
        padding: "0 24px 64px", borderTop: "1px solid #0f0f0f",
        paddingTop: 32 }}>
        <ActivityFeed limit={10} />
      </div>
    </div>
  );
}