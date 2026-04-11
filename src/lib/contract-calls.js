const API = "https://api.hiro.so";
const SENDER = "SP1SY1E599GN04XRD2DQBKV7E62HYBJR2CT9S5QKK";

async function readOnly(contract, fn, args) {
  const [addr, name] = contract.split(".");
  const res = await fetch(`${API}/v2/contracts/call-read/${addr}/${name}/${fn}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ sender: SENDER, arguments: args }),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  if (!data.okay) throw new Error("Contract call failed");
  return data.result;
}

export const Contracts = {
  CORE: `${SENDER}.proofleger3`,
  CREDS: `${SENDER}.credentials`,
  ACHIEVEMENTS: `${SENDER}.achievements`,
  ENDORSEMENTS: `${SENDER}.endorsements`,
  PROFILES: `${SENDER}.profiles`,
};

export const verifyHash = (hash) =>
  readOnly(Contracts.CORE, "get-doc", ["0x0200000020" + hash]);

export const getDocCount = (address) =>
  readOnly(Contracts.CORE, "get-wallet-count", ["0x05" + Buffer.from(address).toString("hex")]);

export const getProfile = (address) =>
  readOnly(Contracts.PROFILES, "get-profile", ["0x05" + Buffer.from(address).toString("hex")]);

export const getEndorsements = (hash) =>
  readOnly(Contracts.ENDORSEMENTS, "get-endorsement-count", ["0x0200000020" + hash]);