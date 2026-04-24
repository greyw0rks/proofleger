"use client";
import { use } from "react";
import { useProfile } from "@/hooks/useProfile";
import ProfileHeader from "@/components/ProfileHeader";
import ProfileStats from "@/components/ProfileStats";
import ReputationBadge from "@/components/ReputationBadge";
import TalentBadge from "@/components/TalentBadge";
import ProofHistory from "@/components/ProofHistory";
import LazySection from "@/components/LazySection";
import Spinner from "@/components/Spinner";

export default function ProfilePage({ params }) {
  const { wallet } = use(params);
  const { profile, loading } = useProfile(wallet);

  if (loading) return (
    <div style={{ minHeight:"100vh", background:"#0a0a0a",
      display:"flex", alignItems:"center", justifyContent:"center" }}>
      <Spinner size={32} />
    </div>
  );

  return (
    <div style={{ maxWidth:720, margin:"0 auto", padding:"40px 24px",
      fontFamily:"Space Grotesk, sans-serif", color:"#f5f0e8",
      minHeight:"100vh", background:"#0a0a0a" }}>

      <ProfileHeader
        address={wallet}
        score={profile?.score || 0}
        docCount={profile?.anchors || 0}
      />

      <div style={{ display:"flex", gap:10, flexWrap:"wrap", marginBottom:24 }}>
        <ReputationBadge score={profile?.score || 0} showScore />
        <TalentBadge address={wallet} compact />
      </div>

      <ProfileStats
        docCount={profile?.anchors || 0}
        attestations={profile?.attests || 0}
        nftCount={profile?.mints || 0}
        score={profile?.score || 0}
      />

      <section style={{ marginBottom:32 }}>
        <div style={{ fontFamily:"Archivo Black, sans-serif", fontSize:11,
          color:"#555", marginBottom:16, letterSpacing:2 }}>
          TRANSACTION HISTORY
        </div>
        <LazySection>
          <ProofHistory address={wallet} limit={50} />
        </LazySection>
      </section>
    </div>
  );
}