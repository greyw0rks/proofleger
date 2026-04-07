"use client";
export default function AttestationCount({ count = 0 }) {
  if (count === 0) return null;
  return (
    <span style={{ display:"inline-flex", alignItems:"center", gap:4, color:"#00ff88", fontFamily:"Space Mono, monospace", fontSize:12 }}>
      <span>✓</span>
      <span>{count} attestation{count !== 1 ? "s" : ""}</span>
    </span>
  );
}
