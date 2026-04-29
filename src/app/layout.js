import { NetworkProvider } from "@/context/NetworkContext";
import { WalletProvider }  from "@/context/WalletContext";
import Nav from "@/components/Nav";

export const metadata = {
  title:       "ProofLedger — Multi-Chain Document Anchoring",
  description: "Anchor and verify document hashes on Stacks and Celo blockchains.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Archivo+Black&family=Space+Mono:wght@400;700&family=Space+Grotesk:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body style={{ margin: 0, background: "#0a0a0a", color: "#f5f0e8" }}>
        <NetworkProvider>
          <WalletProvider>
            <Nav />
            <main>{children}</main>
          </WalletProvider>
        </NetworkProvider>
      </body>
    </html>
  );
}