"use client";

/**
 * SkeletonCard renders animated loading placeholders
 * while ProofLedger fetches blockchain data.
 * @param {{ variant?: "proof"|"profile"|"record", count?: number }} props
 */
export default function SkeletonCard({ variant = "proof", count = 1 }) {
  const items = Array.from({ length: count }, (_, i) => i);
  const shimmer = {
    background: "linear-gradient(90deg, #1a1a1a 25%, #2a2a2a 50%, #1a1a1a 75%)",
    backgroundSize: "200% 100%",
    animation: "shimmer 1.5s infinite",
  };
  const base = { border: "3px solid #2a2a2a", padding: "20px", marginBottom: "16px", background: "#111" };
  const line = (width, height = 14) => ({ ...shimmer, width, height, marginBottom: "10px" });

  return (
    <>
      <style>{`@keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }`}</style>
      {items.map((i) => (
        <div key={i} style={base}>
          {variant === "proof" && (<>
            <div style={line("60%", 18)} />
            <div style={line("40%", 12)} />
            <div style={{ height: 12 }} />
            <div style={line("100%", 10)} />
            <div style={line("90%", 10)} />
          </>)}
          {variant === "profile" && (<>
            <div style={{ display: "flex", gap: 16, marginBottom: 16 }}>
              <div style={{ ...shimmer, width: 64, height: 64 }} />
              <div style={{ flex: 1 }}>
                <div style={line("50%", 20)} />
                <div style={line("30%", 12)} />
              </div>
            </div>
            <div style={line("100%", 10)} />
            <div style={line("80%", 10)} />
          </>)}
          {variant === "record" && (<>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
              <div style={{ ...shimmer, width: "45%", height: 16 }} />
              <div style={{ ...shimmer, width: "25%", height: 16 }} />
            </div>
            <div style={line("70%", 10)} />
          </>)}
        </div>
      ))}
    </>
  );
}
