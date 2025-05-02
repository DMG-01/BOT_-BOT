
















/*import { Transaction, VersionedTransaction, sendAndConfirmTransaction } from '@solana/web3.js'
import { NATIVE_MINT } from '@solana/spl-token'
import axios from 'axios'
//import { connection, owner, fetchTokenAccountData } from '../config'
import { API_URLS } from '@raydium-io/raydium-sdk-v2'


export const owner: Keypair = Keypair.fromSecretKey(bs58.decode('<YOUR_WALLET_SECRET_KEY>'))
export const connection = new Connection('<YOUR_RPC_URL>') //<YOUR_RPC_URL>

const { data: swapResponse } = await axios.get<SwapCompute>(
  `${
    API_URLS.SWAP_HOST
  }/compute/swap-base-in?inputMint=${inputMint}&outputMint=${outputMint}&amount=${amount}&slippageBps=${
    slippage * 100}&txVersion=${txVersion}`
) // Use the URL xxx/swap-base-in or xxx/swap-base-out to define the swap type. 








































































/*



















































require('dotenv').config(); // Load environment variables

const { Keypair, Connection } = require('@solana/web3.js');
const bs58 = require('bs58');
const axios = require('axios');
const bip39 = require('bip39');
const { derivePath } = require('ed25519-hd-key');
const { API_URLS } = require('@raydium-io/raydium-sdk-v2');

(async () => {
  const mnemonic = process.env.MNEMONIC;

  if (!mnemonic) {
    throw new Error("MNEMONIC is not defined in .env");
  }

  const seed = await bip39.mnemonicToSeed(mnemonic);
  const derivedSeed = derivePath("m/44'/501'/0'/0'", seed.toString('hex')).key;
  const keypair = Keypair.fromSeed(derivedSeed);

  console.log('Public key:', keypair.publicKey.toBase58());
  console.log('Secret key (base58):', bs58.encode(keypair.secretKey)); // safer encoding

  // Swap Example (Make sure to define these)
  const inputMint = 'So11111111111111111111111111111111111111112'; // example (SOL)
  const outputMint = 'YourTargetTokenMintHere'; // example
  const amount = 1000000; // in lamports or token base units
  const slippage = 0.5; // 0.5%
  const txVersion = 0; // 0 or 1 depending on support

  const url = `${API_URLS.SWAP_HOST}/compute/swap-base-in?inputMint=${inputMint}&outputMint=${outputMint}&amount=${amount}&slippageBps=${slippage * 100}&txVersion=${txVersion}`;

  try {
    const { data: swapResponse } = await axios.get(url);
    console.log('Swap response:', swapResponse);
  } catch (error) {
    console.error('Swap request failed:', error.response?.data || error.message);
  }
})();
