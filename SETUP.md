## ProofLedger — Local Setup for Hiro Wallet Integration

### 1. Create a Next.js project

npx create-next-app@latest proofleger --app --js --tailwind
cd proofleger


### 2. Install Stacks packages

npm install @stacks/connect @stacks/network @stacks/auth @stacks/transactions


### 3. Add your files

Copy these files into your project:

  src/lib/wallet.js         ← the wallet module
  src/components/WalletButton.jsx  ← the wallet button component
  src/app/page.jsx          ← your ProofLedger component (rename proofleger.jsx)


### 4. Fix the import in WalletButton.jsx

Open WalletButton.jsx and confirm this import path matches your folder structure:
  import { connectWallet, ... } from "@/lib/wallet";


### 5. Update ProofLedger (page.jsx)

At the top of the file, add:
  "use client";

Replace your old wallet button JSX with:
  import WalletButton from "@/components/WalletButton";

In the header section, replace:
  <button className={`wallet-btn ...`} onClick={connectWallet}>...</button>

With:
  <WalletButton />


### 6. Run locally

npm run dev

Open http://localhost:3000
Click "Connect Hiro Wallet"
The Hiro wallet popup will open


### 7. Install the Hiro Wallet extension

If you don't have it:
  Chrome: https://chromewebstore.google.com/detail/hiro-wallet/ldinpeekobnhjjdofggfgjlcehhmanlj
  Firefox: https://addons.mozilla.org/en-US/firefox/addon/hiro-wallet/

Or use Leather wallet — it also supports Stacks and uses the same @stacks/connect API.


### 8. Testnet vs Mainnet

wallet.js has this line at the top:
  const USE_TESTNET = true;

Keep it true while you develop and test.
Switch to false before you deploy to production.

Testnet addresses start with ST
Mainnet addresses start with SP


### What happens under the hood

1. showConnect() opens the Hiro wallet popup
2. User approves the connection
3. The wallet returns an AuthResponse with the user's public key and address
4. userSession.loadUserData() parses the response
5. You get the address from userData.profile.stxAddress.testnet

No private keys are ever exposed to your app.
The wallet signs everything on the user's side.


### Next step

Once wallet connection works, move to step 2:
Wire up the Clarity contract call using @stacks/transactions.
The anchor button will call openContractCall() with the SHA-256 hash.
