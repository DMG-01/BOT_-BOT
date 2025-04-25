import { Web3 } from "web3";

const web3 = new Web3("https://eth-mainnet.g.alchemy.com/v2/4tKqe9wUH_vnTMclsNMVmqgqb86VXbgz");

async function main() {
  const block = await web3.eth.getBlockNumber();
  console.log("Block Number:", block);

  const chainId = await web3.eth.getChainId();
  console.log("Chain ID:", chainId); // 1 = Ethereum

  async function isContract(address) {
    const code = await web3.eth.getCode(address);
    return code !== "0x" && code !== "0x0";
  }

  const result = await isContract("0xdAC17F958D2ee523a2206206994597C13D831ec7");
  console.log(result ? "Contract address" : "EOA address");
}

main();
