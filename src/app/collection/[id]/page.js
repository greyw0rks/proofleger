"use client";
import { use } from "react";
export default function CollectionDetailPage({ params }) {
  const { id } = use(params);
  return (
    <div style={{ maxWidth:720, margin:"0 auto", padding:"40px 24px",
      fontFamily:"Space Grotesk, sans-serif", color:"#f5f0e8", minHeight:"100vh",
      background:"#0a0a0a" }}>
      <a href="/collections" style={{ fontFamily:"Space Mono, monospace", fontSize:11,
        color:"#555", textDecoration:"none", display:"block", marginBottom:20 }}>
        ← COLLECTIONS
      </a>
      <h1 style={{ fontFamily:"Archivo Black, sans-serif", fontSize:24, marginBottom:8 }}>
        Collection #{id}
      </h1>
      <p style={{ color:"#666", fontFamily:"Space Mono, monospace", fontSize:12 }}>
        On-chain document collection · ID: {id}
      </p>
    </div>
  );
}