import { NextResponse } from "next/server";
import { createPublicClient, http, parseAbi } from "viem";

const CELO_CHAIN = { id:42220, name:"Celo",
  nativeCurrency:{ name:"CELO", symbol:"CELO", decimals:18 },
  rpcUrls:{ default:{ http:["https://feth.celo.org"] } } };

const CONTRACT = "0x251B3302c0CcB1cFBeb0cda3dE06C2D312a41735";
const ABI = parseAbi([
  "function getDocument(bytes32 hash) external view returns (address owner, string title, string docType, uint256 blockNumber, bool exists)",
]);

export async function GET(request) {
  const hash = new URL(request.url).searchParams.get("hash");
  if (!hash) return NextResponse.json({ error:"hash required" },{ status:400 });

  try {
    const client = createPublicClient({ chain: CELO_CHAIN, transport: http() });
    const hash32 = hash.startsWith("0x") ? hash : "0x" + hash;
    const [owner, title, docType, blockNumber, exists] = await client.readContract({
      address: CONTRACT, abi: ABI, functionName: "getDocument", args: [hash32],
    });
    return NextResponse.json({ hash, owner, title, docType,
      blockNumber: Number(blockNumber), exists,
      explorer: `https://celoscan.io/address/${CONTRACT}`,
    });
  } catch(e) { return NextResponse.json({ error: e.message },{ status:500 }); }
}