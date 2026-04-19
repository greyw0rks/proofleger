"use client";
import { useState, useEffect } from "react";
import { createPublicClient, http, parseAbi, parseAbiItem } from "viem";

const CELO_CHAIN = { id: 42220, name: "Celo",
  nativeCurrency: { name:"CELO", symbol:"CELO", decimals:18 },
  rpcUrls: { default: { http: ["https://feth.celo.org"] } } };

const CONTRACT = "0x251B3302c0CcB1cFBeb0cda3dE06C2D312a41735";

export function useCeloEvents(limit = 20) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const client = createPublicClient({ chain: CELO_CHAIN, transport: http() });
    client.getLogs({
      address: CONTRACT,
      event: parseAbiItem("event DocumentAnchored(bytes32 indexed hash, address indexed owner, string title, string docType, uint256 blockNumber)"),
      fromBlock: "earliest",
    })
    .then(logs => {
      const parsed = logs.slice(-limit).reverse().map(l => ({
        hash: l.args.hash,
        owner: l.args.owner,
        title: l.args.title,
        docType: l.args.docType,
        blockNumber: Number(l.args.blockNumber || l.blockNumber),
        txHash: l.transactionHash,
      }));
      setEvents(parsed);
    })
    .catch(() => setEvents([]))
    .finally(() => setLoading(false));
  }, [limit]);

  return { events, loading };
}