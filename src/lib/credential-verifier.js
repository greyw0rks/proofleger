import { withRetry } from "./retry";
const API = "https://api.hiro.so";
const C = "SP1SY1E599GN04XRD2DQBKV7E62HYBJR2CT9S5QKK";

async function callReadOnly(contract, fn, args) {
  const res = await fetch(`${API}/v2/contracts/call-read/${C}/${contract}/${fn}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ sender: C, arguments: args }),
  });
  const data = await res.json();
  return data.okay ? data.result : null;
}

export async function verifyCredentialFull(hash) {
  const hexHash = "0x0200000020" + hash.replace("0x","");
  const [core, revoked, endorsed] = await Promise.allSettled([
    callReadOnly("proofleger3", "get-doc", [hexHash]),
    callReadOnly("revocations", "is-revoked", [hexHash]),
    callReadOnly("endorsements", "get-endorsement-count", [hexHash]),
  ]);

  return {
    exists: core.status === "fulfilled" && core.value && core.value !== "0x09",
    revoked: revoked.status === "fulfilled" && revoked.value === "0x03",
    endorsements: endorsed.status === "fulfilled" ? parseInt(endorsed.value || "0", 16) : 0,
    raw: core.status === "fulfilled" ? core.value : null,
  };
}

export async function batchVerify(hashes) {
  return Promise.allSettled(hashes.map(h => verifyCredentialFull(h)));
}