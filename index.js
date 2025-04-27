import { Web3 } from "web3";
import dotenv from "dotenv"
import axios from "axios"
dotenv.config()

const web3 = new Web3("https://eth-mainnet.g.alchemy.com/v2/4tKqe9wUH_vnTMclsNMVmqgqb86VXbgz");
const ETHERSCAN_KEY = process.env.ETHERSCAN_API_KEY


async function main() {
  const block = await web3.eth.getBlockNumber();
  console.log("Block Number:", block);

  const chainId = await web3.eth.getChainId();
  console.log("Chain ID:", chainId); // 1 = Ethereum

  async function isContract(address) {
    const code = await web3.eth.getCode(address);
    return code !== "0x" && code !== "0x0";
  }

  const result = await isContract("0xE592427A0AEce92De3Edee1F18E0157C05861564");
  console.log(result ? "Contract address" : "EOA address");
}

axios.get(`https://api.etherscan.io/v2/api?chainid=1&module=contract&action=getabi&address=${"0xE592427A0AEce92De3Edee1F18E0157C05861564"}&apikey=${ETHERSCAN_KEY}`,{
    address : "0xE592427A0AEce92De3Edee1F18E0157C05861564"
}).then (response => {
   // console.log(response.data)
})
//main();
