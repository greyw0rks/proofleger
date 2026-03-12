/**
 * @fileoverview Stacks API helper functions for ProofLedger
 * Wraps Hiro API calls for transactions, balances, and contract reads
 */

const HIRO_API = "https://api.hiro.so";
const CONTRACT_ADDRESS = "SP1SY1E599GN04XRD2DQBKV7E62HYBJR2CT9S5QKK";

/**
 * Fetches recent transactions for a given Stacks address
 * @param {string} address - Stacks principal address
 * @param {number} [limit=20] - Number of transactions to fetch
 * @returns {Promise<Array>} Array of transaction objects
 */
export async function fetchAddressTransactions(address, limit = 20) {
  const res = await fetch(
    `${HIRO_API}/extended/v1/address/${address}/transactions?limit=${limit}`
  );
  if (!res.ok) throw new Error(`Failed to fetch transactions: ${res.status}`);
  const data = await res.json();
  return data.results || [];
}

/**
 * Fetches STX balance for a given address
 * @param {string} address - Stacks principal address
 * @returns {Promise<{ stx: string, microStx: string }>}
 */
export async function fetchBalance(address) {
  const res = await fetch(
    `${HIRO_API}/extended/v1/address/${address}/balances`
  );
  if (!res.ok) throw new Error(`Failed to fetch balance: ${res.status}`);
  const data = await res.json();
  const microStx = data.stx?.balance || "0";
  const stx = (parseInt(microStx) / 1_000_000).toFixed(6);
  return { stx, microStx };
}

/**
 * Fetches NFTs owned by an address from the achievements contract
 * @param {string} address - Stacks principal address
 * @returns {Promise<Array>} Array of NFT asset identifiers
 */
export async function fetchAchievementNFTs(address) {
  const res = await fetch(
    `${HIRO_API}/extended/v1/tokens/nft/holdings?principal=${address}&asset_identifiers=${CONTRACT_ADDRESS}.achievements::achievement-nft`
  );
  if (!res.ok) throw new Error(`Failed to fetch NFTs: ${res.status}`);
  const data = await res.json();
  return data.results || [];
}

/**
 * Fetches contract call transactions for a specific contract
 * @param {string} contractName - Contract name (e.g. "proofleger3")
 * @param {number} [limit=50] - Number of transactions to fetch
 * @param {number} [offset=0] - Pagination offset
 * @returns {Promise<{ results: Array, total: number }>}
 */
export async function fetchContractTxs(contractName, limit = 50, offset = 0) {
  const contractId = `${CONTRACT_ADDRESS}.${contractName}`;
  const res = await fetch(
    `${HIRO_API}/extended/v1/address/${contractId}/transactions?limit=${limit}&offset=${offset}`
  );
  if (!res.ok) throw new Error(`Failed to fetch contract txs: ${res.status}`);
  return res.json();
}

/**
 * Fetches the current Stacks block height
 * @returns {Promise<number>} Current block height
 */
export async function fetchBlockHeight() {
  const res = await fetch(`${HIRO_API}/extended/v1/info/network_block_times`);
  if (!res.ok) throw new Error(`Failed to fetch block height: ${res.status}`);
  const data = await res.json();
  return data.mainnet?.target_block_time || 0;
}
