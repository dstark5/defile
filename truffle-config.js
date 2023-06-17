const HDWalletProvider = require("@truffle/hdwallet-provider");
const sepoliaTestNetUrl="Paste your sepolia test net url";
const MEMONEIC="Paste your wallet secret phrase if you using sepolia or other testnet";

module.exports = {
  networks: {
    development: {
      host: "http://127.0.0.1",
      port: 9545,
      network_id: "1337", // Match any network id
      gas: 5000000
    },
    sepolia:{
      provider:()=>{
        return new HDWalletProvider(MEMONEIC,sepoliaTestNetUrl)
      },
      from:"Paste your sepolia address",
      network_id:11155111,
      gas:5500000,
      gasPrice: 50000000000,
      networkCheckTimeout: 1000000,
      timeoutBlocks: 200
    }
  },
  compilers: {
    solc: {
      settings: {
        optimizer: {
          enabled: true, // Default: false
          runs: 200      // Default: 200
        },
      }
    }
  }
};
