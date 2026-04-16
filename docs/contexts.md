# ProofLedger Context Providers

## WalletContext

```jsx
import { WalletProvider, useWalletContext } from "@/context/WalletContext";

// Wrap your app
<WalletProvider>
  <App />
</WalletProvider>

// Use anywhere
const { address, connectWallet, disconnectWallet, isConnected } = useWalletContext();
```

## NetworkContext

```jsx
import { NetworkProvider, useNetworkContext } from "@/context/NetworkContext";

const { network, switchNetwork, isStacks, isCelo } = useNetworkContext();
switchNetwork("celo"); // or "stacks"
```

## ProofContext

```jsx
import { ProofProvider, useProofContext } from "@/context/ProofContext";

const { draft, updateDraft, clearDraft, recentProofs } = useProofContext();
updateDraft({ hash: "a1b2...", title: "My Diploma" });
```