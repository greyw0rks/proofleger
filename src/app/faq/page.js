"use client";
import Accordion from "@/components/Accordion";

const FAQS = [
  { question:"What is ProofLedger?",
    answer:"ProofLedger is a multi-chain document anchoring application. It lets you create permanent, verifiable proof that a document existed at a specific point in time by anchoring its SHA-256 hash to Bitcoin via Stacks and to Celo." },
  { question:"What does anchoring a document mean?",
    answer:"Anchoring computes a SHA-256 fingerprint of your document and records it on-chain. The actual document never leaves your device — only the hash is stored. This proves the document existed without exposing its contents." },
  { question:"Can I anchor any file type?",
    answer:"Yes. ProofLedger hashes any file — PDFs, images, Word documents, videos, ZIPs. The hash is computed client-side in your browser and never uploaded to any server." },
  { question:"What does verification prove?",
    answer:"Verification proves that the exact document you uploaded matches the hash recorded on-chain at a specific Bitcoin block height. If even one byte changes, the hash will not match." },
  { question:"How much does it cost?",
    answer:"On Stacks, anchoring costs approximately 0.001 STX (~$0.001). On Celo, gas is sub-cent. The ProofLedger verifier contract charges an additional 0.001 STX per verification query." },
  { question:"Is my document private?",
    answer:"Yes. Only the SHA-256 hash is stored on-chain — never the document itself. Nobody can reconstruct your document from its hash." },
  { question:"What is the difference between Stacks and Celo anchoring?",
    answer:"Stacks anchors to Bitcoin, providing the strongest security guarantees. Celo offers sub-cent fees and 5-second confirmation, ideal for high-volume use cases and mobile (MiniPay) users." },
  { question:"What is an attestation?",
    answer:"An attestation is a third-party endorsement. Another wallet can attest that they have verified your document, adding additional credibility to the proof." },
  { question:"What are ProofLedger NFTs?",
    answer:"NFTs on ProofLedger are soulbound achievement tokens on Stacks. They cannot be transferred and represent milestones like anchoring your first document or reaching certain activity levels." },
];

export default function FAQPage() {
  return (
    <div style={{ maxWidth:720, margin:"0 auto", padding:"40px 24px",
      fontFamily:"Space Grotesk, sans-serif", color:"#f5f0e8",
      minHeight:"100vh", background:"#0a0a0a" }}>
      <h1 style={{ fontFamily:"Archivo Black, sans-serif", fontSize:28, marginBottom:8 }}>FAQ</h1>
      <p style={{ color:"#888", fontSize:13, marginBottom:32 }}>
        Frequently asked questions about ProofLedger
      </p>
      <Accordion items={FAQS} />
      <div style={{ marginTop:40, borderTop:"2px solid #1a1a1a", paddingTop:24,
        fontFamily:"Space Mono, monospace", fontSize:11, color:"#555" }}>
        More questions?{" "}
        <a href="https://github.com/greyw0rks/proofleger"
          target="_blank" rel="noreferrer"
          style={{ color:"#F7931A", textDecoration:"none" }}>
          Open an issue on GitHub ↗
        </a>
      </div>
    </div>
  );
}