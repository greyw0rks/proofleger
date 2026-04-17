import { StacksAPI } from "./stacks-api";
const C = "SP1SY1E599GN04XRD2DQBKV7E62HYBJR2CT9S5QKK";

export async function collectProtocolStats() {
  const contracts = ["proofleger3", "credentials", "achievements", "endorsements"];
  const results = await Promise.allSettled(
    contracts.map(n => StacksAPI.getContractTransactions(C, n, 50))
  );
  const stats = {};
  results.forEach((r, i) => {
    const name = contracts[i];
    if (r.status === "fulfilled") {
      const txs = r.value.results || [];
      const success = txs.filter(t => t.tx_status === "success");
      stats[name] = {
        total: r.value.total || 0,
        recent: txs.length,
        successRate: txs.length > 0 ? Math.round((success.length / txs.length) * 100) : 0,
        functions: success.reduce((acc, t) => {
          const fn = t.contract_call?.function_name || "unknown";
          acc[fn] = (acc[fn] || 0) + 1;
          return acc;
        }, {}),
      };
    }
  });
  return stats;
}

export async function getActiveWallets(days = 7) {
  const data = await StacksAPI.getContractTransactions(C, "proofleger3", 200);
  const cutoff = Date.now() - days * 86400000;
  const wallets = new Set(
    (data.results || [])
      .filter(t => t.tx_status === "success" && new Date(t.burn_block_time_iso).getTime() > cutoff)
      .map(t => t.sender_address)
  );
  return { count: wallets.size, wallets: [...wallets] };
}