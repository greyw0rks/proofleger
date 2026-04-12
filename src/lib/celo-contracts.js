export const CELO_PROOF_LEDGER_ADDRESS = "0x251B3302c0CcB1cFBeb0cda3dE06C2D312a41735";
export const CELO_CHAIN_ID = 42220;
export const CELO_RPC = "https://feth.celo.org";
export const CELO_EXPLORER = "https://celoscan.io";

export const PROOF_LEDGER_ABI = [
  { name:"anchorDocument", type:"function", stateMutability:"nonpayable",
    inputs:[{name:"hash",type:"bytes32"},{name:"title",type:"string"},{name:"docType",type:"string"}], outputs:[] },
  { name:"attestDocument", type:"function", stateMutability:"nonpayable",
    inputs:[{name:"hash",type:"bytes32"},{name:"credentialType",type:"string"}], outputs:[] },
  { name:"verifyDocument", type:"function", stateMutability:"view",
    inputs:[{name:"hash",type:"bytes32"}],
    outputs:[{type:"tuple",components:[
      {name:"owner",type:"address"},{name:"blockNumber",type:"uint256"},
      {name:"timestamp",type:"uint256"},{name:"title",type:"string"},
      {name:"docType",type:"string"},{name:"attestationCount",type:"uint256"},
      {name:"exists",type:"bool"}
    ]}] },
  { name:"documentCount", type:"function", stateMutability:"view",
    inputs:[{name:"owner",type:"address"}], outputs:[{type:"uint256"}] },
  { name:"totalDocuments", type:"function", stateMutability:"view",
    inputs:[], outputs:[{type:"uint256"}] },
  { name:"DocumentAnchored", type:"event",
    inputs:[{name:"hash",type:"bytes32",indexed:true},{name:"owner",type:"address",indexed:true},
            {name:"title",type:"string",indexed:false},{name:"docType",type:"string",indexed:false},
            {name:"blockNumber",type:"uint256",indexed:false}] },
];