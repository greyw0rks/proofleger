"use client";
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
}