/**
 * Example: Using proofleger-sdk in your own app
 *
 * npm install proofleger-sdk
 */
const {
  hashBuffer,
  verifyDocument,
  calculateReputation,
  truncateHash,
  truncateAddress,
} = require("proofleger-sdk");

const fs = require("fs");

async function main() {
  // Hash a local file
  const fileBuffer = fs.readFileSync("./my-document.pdf");
  const hash = hashBuffer(fileBuffer);
  console.log("SHA-256:", hash);
  console.log("Display:", truncateHash(hash));

  // Verify it on-chain
  const proof = await verifyDocument(hash);
  if (proof) {
    console.log("Found on ProofLedger!");
  } else {
    console.log("Not yet anchored.");
  }

  // Calculate reputation
  const rep = calculateReputation([
    { docType: "diploma", attestations: 2, hasNFT: true },
    { docType: "certificate", attestations: 1, hasNFT: false },
  ]);
  console.log(`Reputation: ${rep.score} pts (${rep.tier})`);
}

main().catch(console.error);
