import { sha256File, sha256Text, isValidSha256 } from "@/utils/crypto";

export async function prepareProof(input, title, docType) {
  if (!title?.trim()) throw new Error("Title is required");
  if (!docType) throw new Error("Document type is required");
  let hash;
  if (input instanceof File) {
    hash = await sha256File(input);
  } else if (typeof input === "string") {
    if (isValidSha256(input)) hash = input.replace("0x", "");
    else hash = await sha256Text(input);
  } else {
    throw new Error("Input must be a File or string");
  }
  return { hash, title: title.trim(), docType };
}

export function buildProofUrl(hash) {
  return `https://proofleger.vercel.app/verify?hash=${hash}`;
}

export function buildShareText(title, hash) {
  return `I just anchored "${title}" to Bitcoin via ProofLedger.\n\nVerify: ${buildProofUrl(hash)}\n\n#Bitcoin #Stacks #ProofOfExistence`;
}