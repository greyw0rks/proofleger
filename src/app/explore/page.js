"use client";
import { useState } from "react";
import ActivityFeed from "@/components/ActivityFeed";
import CeloActivityFeed from "@/components/CeloActivityFeed";
import NetworkToggle from "@/components/NetworkToggle";
import { useNetworkContext } from "@/context/NetworkContext";

export default function ExplorePage() {
  const { network } = useNetworkContext();
  return (
    <div style={{ maxWidth:720, margin:"0 auto", padding:"40px 24px",
      fontFamily:"Space Grotesk, sans-serif", color:"#f5f0e8",
      minHeight:"100vh", background:"#0a0a0a" }}>
      <div style={{ display:"flex", justifyContent:"space-between",
        alignItems:"flex-end", marginBottom:32 }}>
        <div>
          <h1 style={{ fontFamily:"Archivo Black, sans-serif", fontSize:28, marginBottom:4 }}>
            EXPLORE
          </h1>
          <p style={{ color:"#888", fontSize:13 }}>Browse recent on-chain proof activity</p>
        </div>
        <NetworkToggle />
      </div>
      {network.id === "stacks"
        ? <ActivityFeed limit={25} />
        : <CeloActivityFeed limit={25} />
      }
    </div>
  );
}