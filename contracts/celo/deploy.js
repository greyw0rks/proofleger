const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log(`Deploying to ${hre.network.name} from ${deployer.address}`);

  const ProofLedger = await hre.ethers.getContractFactory("ProofLedger");
  const proofLedger = await ProofLedger.deploy();
  await proofLedger.waitForDeployment();
  console.log(`ProofLedger: ${await proofLedger.getAddress()}`);

  const Credentials = await hre.ethers.getContractFactory("ProofLedgerCredentials");
  const credentials = await Credentials.deploy();
  await credentials.waitForDeployment();
  console.log(`Credentials: ${await credentials.getAddress()}`);

  console.log("\nUpdate CELO_CONTRACT_ADDRESS in src/lib/wallet-celo.js");
}

main().catch(err => { console.error(err); process.exit(1); });
