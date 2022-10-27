import React, { useState } from "react";
import "styles/globals.css";
import { SessionProvider } from "next-auth/react";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import {
  LedgerWalletAdapter,
  PhantomWalletAdapter,
  SlopeWalletAdapter,
  SolflareWalletAdapter,
  SolletExtensionWalletAdapter,
  SolletWalletAdapter,
  TorusWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import { clusterApiUrl } from "@solana/web3.js";
import { useMemo } from "react";
import { ToastContainer } from "react-toastify";
import { useWallet } from "@solana/wallet-adapter-react";
import { signOut } from "next-auth/react";
require("react-toastify/dist/ReactToastify.css");
require("@solana/wallet-adapter-react-ui/styles.css");

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  const network = WalletAdapterNetwork.Mainnet;
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);
  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SlopeWalletAdapter(),
      new SolflareWalletAdapter(),
      new LedgerWalletAdapter(),
      new SolletWalletAdapter({ network }),
      new SolletExtensionWalletAdapter({ network }),
    ],
    [network]
  );

  const [walletConnected, setWalletConnected] = useState(false);

  const signOutWallets = () => {
    setWalletConnected(false);
    signOut({
      redirect: false,
    });
  };

  return (
    <SessionProvider session={session}>
      <ConnectionProvider endpoint={endpoint}>
        <WalletProvider wallets={wallets} autoConnect>
          <WalletModalProvider>
            <Component
              {...pageProps}
              walletConnected={walletConnected}
              setWalletConnected={setWalletConnected}
            />
            <ToastContainer
              position="bottom-center"
              autoClose={3000}
              theme="dark"
              closeOnClick={true}
              pauseOnHover={false}
              pauseOnFocusLoss={false}
            />
          </WalletModalProvider>
        </WalletProvider>
      </ConnectionProvider>
    </SessionProvider>
  );
}

export default MyApp;
