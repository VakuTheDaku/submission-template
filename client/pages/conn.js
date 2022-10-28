const contractABI = require("./Contract.json");
const YOUR_CONTRACT_ADDRESS = "0x08a8b6C0f819E1fD191ca4C8077B7d4A9a659826";
import { ethers } from "ethers"
const getContract = (window) => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    let contract = new ethers.Contract(
        YOUR_CONTRACT_ADDRESS,
        contractABI,
        signer
    );
    return contract;
};

export default getContract