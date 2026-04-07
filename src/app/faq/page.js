"use client";
const FAQS = [
  { q:"What is ProofLedger?", a:"ProofLedger lets you anchor SHA-256 hashes of documents permanently to Bitcoin via Stacks. It proves a document existed at a specific time without revealing the content." },
  { q:"Is my document uploaded?", a:"No. Your file never leaves your browser. We compute a SHA-256 hash locally and only the hash is sent to the blockchain." },
  { q:"What does anchoring cost?", a:"Each anchor transaction costs approximately 0.001 STX in fees. You need a small amount of STX in your Hiro Wallet." },
  { q:"Can I verify without a wallet?", a:"Yes. The verify function is read-only and requires no wallet connection." },
  { q:"What is a soulbound NFT?", a:"Achievement NFTs are non-transferable tokens tied to your wallet. They represent verified credentials and cannot be sold or moved." },
];
export default function FaqPage() {
  return (
    <div style={{ maxWidth:720, margin:"80px auto", padding:"0 24px", fontFamily:"Space Grotesk, sans-serif", color:"#f5f0e8" }}>
      <h1 style={{ fontFamily:"Archivo Black, sans-serif", fontSize:28, marginBottom:32 }}>FAQ</h1>
      {FAQS.map((f,i) => (
        <div key={i} style={{ borderBottom:"2px solid #222", paddingBottom:20, marginBottom:20 }}>
          <h3 style={{ fontFamily:"Archivo Black, sans-serif", fontSize:16, color:"#F7931A", marginBottom:8 }}>{f.q}</h3>
          <p style={{ color:"#888", lineHeight:1.7 }}>{f.a}</p>
        </div>
      ))}
    </div>
  );
}
