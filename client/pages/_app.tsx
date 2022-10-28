import React, { useState } from "react";
import "styles/globals.css";
import getContract from "./conn"

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  const [wallet, setWallet] = useState(0)
    
  return (
    
            <Component
              {...pageProps}
              getContract = {getContract}
              walletConnected = {wallet}
            />
         
  )
}

export default MyApp;
