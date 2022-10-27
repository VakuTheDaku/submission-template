import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'

import { useState } from 'react';
import { useEffect } from 'react';
import { ethers } from 'ethers';

export default function Home() {

  // smart contract 

  const contractABI = require("./Contract.json");
  const YOUR_CONTRACT_ADDRESS = "0xef9e38A19F81f499c7A63DA73Ce4a1C4b7b3Dfea";

  const connectWalletProvider = async () => {
    try {
      const { ethereum } = window;
      if (!ethereum) {
        // Wallet not installed
        alert("Get MetaMask!");
        return;
      }

      // Change network to rinkeby
      await ethereum.enable();
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      // await ethereum.request({
      //     method: "wallet_switchEthereumChain",
      //     params: [{ chainId: `0x${Number(5).toString(16)}` }],
      //     // I have used Rinkeby, so switching to network ID 4
      // });
      console.log("Connected", accounts[0]);
      localStorage.setItem("walletAddress", accounts[0]);

      // For debugging
      fetchCurrentValue();
      fetchAllRecords();
      //
    } catch (error) {
      console.log(error);
    }
  };

  let getContract = () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    let contract = new ethers.Contract(
      YOUR_CONTRACT_ADDRESS,
      contractABI,
      signer
    );
    return contract;
  };

  let fetchCurrentValue = async () => {
    // let count_ = await getContract().createRecord(123, 'allergies', 'symptoms', 'diagonosis');
    let count_ = await getContract().getRecordCount();
    console.log(count_.toString());
    // setCount(count_.toString());
  };

  let fetchAllRecords = async () => {
    let count = await getContract().getRecordCount();

    for (let i = 0; i < count; i++) {
      let record = await getContract().getRecord(i);
      console.log(record);
    }

  };

  useEffect(() => {
    
    if (window.ethereum) {
      // Listeners
      window.ethereum.on("chainChanged", () => {
        window.location.reload();
      });
      window.ethereum.on("accountsChanged", () => {
        checkedWallet();
      });
    }
  }, []);

  //


  return (
    <div className="">
      <div className='min-h-screen grid place-items-center'>
        <button className='btn btn-success' onClick={async ()=>connectWalletProvider}>
          Connect to MetaMask
        </button>
      </div>
    </div>
  )
}
