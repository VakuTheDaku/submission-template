import { AiFillCheckCircle } from 'react-icons/ai';
import React from 'react';
import { useEffect } from 'react';
import { ethers } from "ethers";

export default function Home() {


    return (
        <div className='flex flex-col items-center'>

            <div className="text-3xl text-white bg-transparent">
                Home page
            </div>
            <div className='bg-slate-400 p-10'>
                <div className='w-[300px] aspect-square bg-red-400 rounded-sm flex flex-col justify-between'>
                    NFT
                    {/* <div>name</div> */}
                    <div>collection name</div>
                </div>
                <p className='text-black mt-2'>Creator Address: sadXXXXAXAXASSZSDA</p>
                <p className='text-black'>Mint    Address: XXGAJUIKX,jsdfk</p>
            </div>
            <div className='flex bg-slate-50 gap-8 px-5 py-2 rounded-sm mt-6 items-center'>
                <p className='text-black'>Wallet is verified</p>
                <AiFillCheckCircle size={'30px'} color={'green'} />
            </div>
        </div>
    )
}