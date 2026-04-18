export const ERROR_TYPES = {
  WALLET_NOT_CONNECTED: "wallet_not_connected",
  USER_REJECTED: "user_rejected",
  INSUFFICIENT_FUNDS: "insufficient_funds",
  RATE_LIMITED: "rate_limited",
  CONTRACT_ERROR: "contract_error",
  NETWORK_ERROR: "network_error",
  INVALID_INPUT: "invalid_input",
  ALREADY_EXISTS: "already_exists",
  NOT_FOUND: "not_found",
};

const USER_MESSAGES = {
  wallet_not_connected: "Please connect your Hiro Wallet to continue",
  user_rejected: "Transaction was rejected in your wallet",
  insufficient_funds: "Insufficient STX balance. You need at least 0.01 STX",
  rate_limited: "Too many requests. Please wait a moment and try again",
  contract_error: "Transaction failed on-chain. The contract rejected the call",
  network_error: "Could not connect to Stacks network. Check your connection",
  invalid_input: "Invalid input. Please check your document hash and title",
  already_exists: "This document hash has already been anchored",
  not_found: "Document not found on chain",
};

export function classifyError(error) {
  const msg = error?.message?.toLowerCase() || "";
  if (msg.includes("not connected") || msg.includes("no wallet")) return ERROR_TYPES.WALLET_NOT_CONNECTED;
  if (msg.includes("rejected") || msg.includes("cancelled") || msg.includes("denied")) return ERROR_TYPES.USER_REJECTED;
  if (msg.includes("insufficient") || msg.includes("balance")) return ERROR_TYPES.INSUFFICIENT_FUNDS;
  if (msg.includes("429") || msg.includes("rate limit")) return ERROR_TYPES.RATE_LIMITED;
  if (msg.includes("already") || msg.includes("u100") || msg.includes("u1")) return ERROR_TYPES.ALREADY_EXISTS;
  if (msg.includes("not found") || msg.includes("u102")) return ERROR_TYPES.NOT_FOUND;
  if (msg.includes("contract") || msg.includes("clarity")) return ERROR_TYPES.CONTRACT_ERROR;
  if (msg.includes("network") || msg.includes("fetch")) return ERROR_TYPES.NETWORK_ERROR;
  return ERROR_TYPES.NETWORK_ERROR;
}

export function getUserMessage(error) {
  const type = classifyError(error);
  return USER_MESSAGES[type] || "An unexpected error occurred. Please try again";
}

export function isRetryable(error) {
  const type = classifyError(error);
  return [ERROR_TYPES.RATE_LIMITED, ERROR_TYPES.NETWORK_ERROR].includes(type);
}