import { downloadJSON, downloadText } from "@/utils/download";

export function exportProofCertificate(proof) {
  const cert = {
    certificate: "ProofLedger Document Certificate",
    version: "1.0",
    issuedAt: new Date().toISOString(),
    document: {
      hash: proof.hash,
      title: proof.title,
      docType: proof.docType,
      owner: proof.owner,
    },
    blockchain: {
      network: proof.network || "Stacks Mainnet",
      blockHeight: proof.blockHeight,
      transactionId: proof.txId,
      anchored: true,
    },
    verifyUrl: `https://proofleger.vercel.app/verify?hash=${proof.hash}`,
    verifier: {
      contract: "SP1SY1E599GN04XRD2DQBKV7E62HYBJR2CT9S5QKK.proofleger3",
      explorer: `https://explorer.hiro.so/txid/${proof.txId}`,
    },
  };
  downloadJSON(cert, `proofleger-cert-${proof.hash.slice(0,8)}.json`);
  return cert;
}

export function exportProofText(proof) {
  const text = [
    "=".repeat(50),
    "PROOFLEGER DOCUMENT CERTIFICATE",
    "=".repeat(50),
    `Title:       ${proof.title}`,
    `Type:        ${proof.docType}`,
    `Hash:        ${proof.hash}`,
    `Owner:       ${proof.owner}`,
    `Block:       ${proof.blockHeight}`,
    `Network:     Stacks Mainnet → Bitcoin`,
    `Verify:      https://proofleger.vercel.app/verify?hash=${proof.hash}`,
    "=".repeat(50),
  ].join("\n");
  downloadText(text, `proofleger-cert-${proof.hash.slice(0,8)}.txt`);
  return text;
}