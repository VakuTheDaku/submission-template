import Navbar from "../components/navbar"
import Image from "next/image";

import { useState, Fragment, useEffect } from "react";
import { FaDiscord, FaTwitter, FaLink, FaCopy, FaUnlink } from "react-icons/fa";

import { IoMdClose } from "react-icons/io";
import {
  WalletMultiButton,
  WalletModalButton,
} from "@solana/wallet-adapter-react-ui";
import { Dialog, Transition, Tab } from "@headlessui/react";

import { signIn, signOut, useSession } from "next-auth/react";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { SystemProgram, Transaction } from "@solana/web3.js";
import { toast } from "react-toastify";

import { MdClose } from "react-icons/md";
import { Connection } from '@metaplex/js';
import { Metadata } from '@metaplex-foundation/mpl-token-metadata';
import { usePromiseTracker } from "react-promise-tracker";
import { trackPromise } from 'react-promise-tracker';
import next from "next";
const baseUrl = "http://localhost:3000";

export default function Home({ walletConnected, setWalletConnected }) {
  const {
    publicKey,
    connected,
    disconnect,
    signMessage,
    sendTransaction,
    signTransaction,
  } = useWallet();
  const { connection } = useConnection();
  const [isOpen, setIsOpen] = useState(false);
  const [discordConnected, setDiscordConnected] = useState(false);
  const [twitterConnected, setTwitterConnected] = useState(false);
  const [discordId, setDiscordId] = useState("");
  const [twitterId, setTwitterId] = useState("");
  const [loading, setLoading] = useState(false);
  const [signing, setSigning] = useState(false);
  const [adding, setAdding] = useState(false);
  const [wallets, setWallets] = useState([]);
  const [tab, setTab] = useState(0);
  const [arr, setArr] = useState();
  const [accountsTab, setAccountsTab] = useState(0);
  
  const { data: session, status } = useSession();
  const connnection = new Connection("mainnet-beta");
  const tokenAddress = "Fd2ChEBvrwVQxNLywLL8XgDUKB1WwWVQhJAdXZNWP395";
  const [metadata, setMetadata] = useState<Metadata>([])
  const [imageurl, setImageurl] = useState<Object>()
 

  useEffect(() => {
    (async function () {
      
      if (status !== "loading") {
        if (session) {
          setLoading(false);
          if (session.user) {
            console.log("Session user found", session.user);
            if (session.user.id) {
              
              setWalletConnected(true);
              const userwallets = await fetch(`${baseUrl}/users/${session.user.id}`, { method: 'GET' }).then(response => response.json())
              console.log(userwallets)
              if(userwallets.wallets!==null){
                setWallets(userwallets.wallets)
              }else{
                setWallets(session.user.wallets);
              }

              
              let res = await fetch(
                `${baseUrl}/users/verify/${session.user.id}`,
                {
                  method: "GET",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  credentials: "include",
                }
              );
              if (res.ok) {
                res = await res.json();
                setDiscordConnected(true);
                setDiscordId(res.discordId);
                if (res.twitterId) {
                  setTwitterConnected(true);
                  setTwitterId(res.twitterId);
                }

                setWallets(res.wallets);
                userwallets.wallets?getImage(userwallets.wallets):getImage(session.user.wallets)
                setLoading(false);
              } else {
                res = await res.json();
                console.log("Could not verify user details");
                setDiscordConnected(false);
                setTwitterConnected(false);
                setWallets(res.wallets);
                setLoading(false);
              }
            }
            const error = localStorage.getItem("error");
            if (error === null || (error === "true" && session.user.error)) {
              toast.error(session.user.error);
            }
            localStorage.setItem("error", false);
          } else {
            setDiscordConnected(false);
            setTwitterConnected(false);
            setWallets([]);
            setLoading(false);
            console.log("No session user found");
          }
        } else {
          disconnect();
          setWalletConnected(false);
          setDiscordConnected(false);
          setTwitterConnected(false);
          setWallets([]);
          setLoading(false);
          disconnect();
          console.log("No session variable found");
        }
      }
    })();
  }, [status]);

  useEffect(() => {
    (async function () {
      if (status !== "loading" && !connected) {
        console.log("Disconnected wallet");
        disconnectWallet();
      }
    })();
  }, [connected]);

  const fetchNonce = async () => {
    const response = await fetch("/api/login");
    if (response.status != 200) throw new Error("nonce could not be retrieved");
    const { nonce } = await response.json();
    return nonce;
  };

  const handleWallet = async (type) => {
    if (!publicKey) throw new Error("Wallet not connected!");
    if (!signMessage)
      throw new Error("Wallet does not support message signing!");
    if (
      (session?.user?.id && session.user.id === publicKey.toBase58()) ||
      wallets
        .map((ow) => {
          return ow.walletId;
        })
        .includes(publicKey.toBase58())
    ) {
      toast.error("Wallet already added");
      return;
    }
    setSigning(true);
    localStorage.setItem("error", true);
    if (type === 0) {
      try {
        const nonce = await fetchNonce();
        const message = new TextEncoder().encode(`$VAPE: ${nonce}`);
        const signedMessage = await solana.request({
          method: "signMessage",
          params: {
            message: message,
          },
        });
        console.log("Signing in wallet");
        signIn("credentials", {
          publicKey: signedMessage.publicKey,
          signature: signedMessage.signature,
          type: type,
          id: session?.user?.id,
          callbackUrl: `${window.location.origin}`,
        });
        setLoading(true);
        setIsOpen(false);
        disconnect();
      } catch (error) {
        setSigning(false);
        setAdding(false);
        setLoading(false);
        toast.error(`Could not approve! ${error?.message}`);
      }
    } else if (type == 1) {
      let signature: Transaction;
      try {
        const transaction = new Transaction().add(
          SystemProgram.transfer({
            fromPubkey: publicKey,
            toPubkey: publicKey,
            lamports: 1,
          })
        );
        transaction.recentBlockhash = (
          await connection.getRecentBlockhash()
        ).blockhash;
        transaction.feePayer = publicKey;
        signature = await signTransaction(transaction, connection);
        console.log(signature);
        const serializedTransaction = transaction.serialize();
        const transactionBase64 = serializedTransaction.toString("base64");

        console.log("serilised:", serializedTransaction);
        console.log("Transaction sent");
        toast.success("Transaction successful!");
        signIn("credentials", {
          publicKey: publicKey?.toBase58(),
          signature: transactionBase64,
          type: type,
          id: session?.user?.id ? session.user.id : null,
          callbackUrl: `${window.location.origin}/home`,
        });
        setLoading(true);
        setIsOpen(false);
        disconnect();
      } catch (error: any) {
        toast.error(`Transaction failed! ${error?.message}`);
        setSigning(false);
        setAdding(false);
        setLoading(false);
        return;
      }
    }
    return;
  };
  
  const disconnectWallet = async () => {
    if (loading) return;
    console.log("Disconnecting wallet");
    setWalletConnected(false);
    setDiscordConnected(false);
    setTwitterConnected(false);
    signOut({
      redirect: false,
    });
    return;
  };

 


 

  const removeWallet = async (deleteWalletId) => {
    console.log(deleteWalletId)
    if (loading) return;
    const newwallets = wallets.filter((otherWallet) => otherWallet.walletId !== deleteWalletId)
    console.log(newwallets)
    setWallets(
      newwallets
    );

    let res = await fetch(`${baseUrl}/users/wallets/remove`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: session?.user?.id,
        deleteWalletId: deleteWalletId,
      }),
      credentials: "include",
    });
    const user = await fetch(`${baseUrl}/users/${session.user.id}`, { method: 'GET' }).then(response => response.json())
    console.log("user",user.wallets)
    setWallets(user.wallets);
    setDiscordConnected(user.isConnected)
    getImage(user.wallets)


    if (!res.ok) {
      toast.error("Could not remove the wallet");
    }
  };

 
  const classNames = (...classes) => {
    return classes.filter(Boolean).join(" ");
  };

  return (
    <div className="bg-black md:px-10 h-screen flex flex-col-reverse md:flex-col">
      <Navbar />
      <div className="text-white flex md:flex-row flex-col-reverse justify-center items-center flex-1">
        <div className="md:w-2/3 flex flex-col items-center md:space-y-24">
          <h1 className="hidden md:block text-5xl font-bold text-center leading-tight">
            CONNECT TO VERIFY<br></br>
           
          </h1>
          <div className="space-y-2">
            <p className="text-lg">Connect your wallet</p>
            <div className="text-center">
              <button
                className="md:bg-custom-yellow text-custom-yellow md:text-black border-4 border-custom-yellow md:border-none text-lg font-bold rounded-xl py-2 px-3 hover:bg-amber-400 transition"
                onClick={() => {
                  setIsOpen(true);
                }}
              >
                SELECT WALLET
              </button>
            </div>
          </div>
        </div>
        <div className="h-0.5 w-full md:w-0.5 md:h-full my-10 md:mt-0 md:mx-5 bg-gradient-to-r md:bg-gradient-to-b from-black via-custom-yellow to-black">
          {""}
        </div>
      
        <div className="md:w-1/3 flex flex-col items-center space-y-3 md:space-y-5">
          <div className="mb-10 md:mb-0">
            
          </div>
          
        </div>
      </div>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-10 overflow-y-auto bg-black bg-opacity-50"
          onClose={() => {
            if (publicKey) setIsOpen(false);
            disconnect();
          }}
        >
          <div className="min-h-screen px-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0" />
            </Transition.Child>

            {/* This element is to trick the browser into centering the modal contents. */}
            <span
              className="inline-block h-screen align-middle"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <div className="inline-block w-full max-w-lg p-6 pb-14 overflow-hidden text-left align-middle transition-all transform bg-800 shadow-xl rounded-2xl bg-gray-900 text-white">
                <div className="flex justify-end text-gray-400 hover:text-white transition duration-150">
                  <button
                    type="button"
                    className="rounded-full w-10 h-10 bg-gray-800"
                    onClick={() => {
                      disconnect();
                      setIsOpen(false);
                      setSigning(false);
                      setAdding(false);
                    }}
                  >
                    <div className="flex justify-center items-center">
                      <IoMdClose size={25} />
                    </div>
                  </button>
                </div>
                <div className="flex flex-col w-100 items-center space-y-6">
                  <Dialog.Title
                    as="h4"
                    className="text-xl font-medium leading-6"
                  >
                    {publicKey
                      ? "Wallet Selected"
                      : adding
                        ? "Choose Wallet from the Extension"
                        : "Choose Wallet"}
                  </Dialog.Title>
                  {publicKey ? <WalletMultiButton /> : <WalletModalButton />}
                  {publicKey && (
                    <div className="flex space-y-6 w-full flex-col items-center">
                      <Tab.Group>
                        {/* <Tab.List className="w-full flex p-1 space-x-1 bg-blue-900/20 rounded-xl">
                          <Tab
                            className={({ selected }) =>
                              classNames(
                                "p-3 w-full text-sm leading-5 font-medium text-blue-700 rounded-lg",
                                "focus:outline-none",
                                selected
                                  ? "bg-gray-200 shadow"
                                  : "text-blue-100 hover:bg-white/[0.12] hover:text-white transition"
                              )
                            }
                            onClick={() => {
                              handleWallet(0);
                            }}
                          >
                            Sign to verify
                          </Tab>
                        </Tab.List> */}
                        <Tab.Panels className="text-center line-clamp-{2}">
                          <Tab.Panel className="space-y-4 text-center flex justify-center flex-col max-w-sm">
                            {signing ? (
                              <p>
                                Approving Transaction<br></br>Please wait while
                                we verify your wallet
                              </p>
                            ) : (
                              <p>
                                Send a transaction to yourself to prove
                                ownership of the wallet
                              </p>
                            )}
                            <div className="mx-auto">
                              <button
                                onClick={() => {
                                  handleWallet(1);
                                }}
                                disabled={signing}
                                className="hover:bg-violet-900 w-44 flex flex-row justify-center align-center space-x-3 text-white py-3 px-6 text-sm tracking-wide bg-violet-800 rounded-md shadow-md transition"
                              >
                            
                              </button>
                            </div>
                          </Tab.Panel>
                        </Tab.Panels>
                      </Tab.Group>
                    </div>
                  )}
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
}
