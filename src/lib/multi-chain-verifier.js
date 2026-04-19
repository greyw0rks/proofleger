import { cacheWrap } from "./cache";
const STACKS_API = "https://api.hiro.so";
const CELO_RPC   = "https://feth.celo.org";
const STACKS_C   = "SP1SY1E599GN04XRD2DQBKV7E62HYBJR2CT9S5QKK";
const CELO_C     = "0x251B3302c0CcB1cFBeb0cda3dE06C2D312a41735";

async function verifyOnStacks(hashHex) {
  try {
    const clean = hashHex.replace("0x","");
    const res = await fetch(`${STACKS_API}/v2/contracts/call-read/${STACKS_C}/proofleger3/get-doc`, {
      method:"POST", headers:{"Content-Type":"application/json"},
      body: JSON.stringify({ sender: STACKS_C, arguments: ["0x0200000020" + clean] }),
    });
    const data = await res.json();
    return data.okay && data.result && data.result !== "0x09";
  } catch { return false; }
}

async function verifyOnCelo(hashHex) {
  try {
    const hash32 = hashHex.startsWith("0x") ? hashHex : "0x" + hashHex;
    // keccak256 signature of getDocument(bytes32)
    const sig = "0x" + "getDocument(bytes32)".split("").map(c => c.charCodeAt(0).toString(16).padStart(2,"0")).join("").slice(0,8);
    const padded = hash32.slice(2).padStart(64,"0");
    const res = await fetch(CELO_RPC, {
      method:"POST", headers:{"Content-Type":"application/json"},
      body: JSON.stringify({ jsonrpc:"2.0", method:"eth_call",
        params:[{ to: CELO_C, data: "0x6a3d1600" + padded }, "latest"], id:1 }),
    });
    const data = await res.json();
    if (!data.result || data.result === "0x") return false;
    // Last 32 bytes encode the `exists` bool
    return data.result.slice(-64) !== "00".repeat(31) + "00";
  } catch { return false; }
}

export async function verifyMultiChain(hashHex) {
  const [stacks, celo] = await Promise.allSettled([
    verifyOnStacks(hashHex),
    verifyOnCelo(hashHex),
  ]);
  return {
    hash: hashHex,
    stacks: stacks.status === "fulfilled" ? stacks.value : false,
    celo:   celo.status === "fulfilled"   ? celo.value   : false,
    isMultiChain: stacks.value === true && celo.value === true,
  };
}