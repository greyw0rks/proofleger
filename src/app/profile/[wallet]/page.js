"use client";
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
}