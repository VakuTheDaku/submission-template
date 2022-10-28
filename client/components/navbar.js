import { useState } from "react"
import { MdHealthAndSafety } from "react-icons/bi"
export default function Navbar({walletConnected}){
    
   
    return(

        <div className="top-0 bg-zinc-500">
            <div className="flex justify-between">
                {/* <div className="">
                    <MdHealthAndSafety/>
                </div> */}
                <div className="text-white text-xl text-red-800 font-bold my-3 px-2 ml-8 uppercase">
                    Demedify
                </div>
                <div className="bg-zinc-300 p-4">
                    <div className="flex ">
                        <div className="text-black mr-4">
                            Pub key: 
                        </div>
                        <div className="text-black">
                            {()=>{
                                if (typeof window !== 'undefined') {
                                    // Perform localStorage action
                                    wallet = localStorage.getItem("walletAddress")
                                    return wallet
                                }
                            }
                        }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}