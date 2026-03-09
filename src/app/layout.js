import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "ProofLedger",
  description: "Anchor any document to Bitcoin. Permanent, verifiable, unstoppable.",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.png",
  },
  other: {
    "talentapp:project_verification": "7c4d9c27c05487de9c9c8311c264d068d13e16c2b3081a55a876b2ea513b164bfeebb83be1a757f3069c4a9ef639852de795bedb56c1b258fc3bb76809d168cb",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {children}
      </body>
    </html>
  );
}
