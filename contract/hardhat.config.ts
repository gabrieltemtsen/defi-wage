import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

import * as dotenv from "dotenv"

dotenv.config();
const QUICKNODE_HTTP_URL = process.env.QUICKNODE_HTTP_URL;
const SCROLL_SEPOLIA_KEY = process.env.SCROLL_SEPOLIA_KEY;



const config: HardhatUserConfig = {
  solidity: "0.8.20",
  
  networks: {
    scrollSepolia: {
      url: "https://sepolia-rpc.scroll.io/" || "",
      chainId: 534351,    
      accounts:
        process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
  },
  etherscan: {
    apiKey: {
      scrollSepolia: 'abi' || '',
    },
    customChains: [
      {
        network: 'scrollSepolia',
        chainId: 534351,
        urls: {
          apiURL: 'https://sepolia-blockscout.scroll.io/api',
          browserURL: 'https://sepolia-blockscout.scroll.io/',
        },
      },
    ],
  },
  
  

};

export default config;
