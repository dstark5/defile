
# DeFile

A Web3 App for Storing Files in a  decentralized secure way using IPFS and Ethereum Blockchain with Truffle and VueJs



[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)


## 🔗 Link

https://defile.netlify.app

##### The website requires Metamask wallet extension and account on sepolia Test net

## Requirements

- Nodejs

- Truffle

- Metamask


## Features

- Decentalized storage of files
- Files are encrypted and decrypted in browser


## Run Locally

Clone the project

```bash
  git clone https://github.com/dine-5h/defile
```

Go to the project directory

```bash
  cd defile
```

Install dependencies

```bash
  npm install
```

### Truffle Configuration


Copy secret phrase from Metamask wallet and paste in 'truffle-config.js' and paste in MEMONEIC variable

```javascript
const MEMONEIC="Paste your wallet secret phrase if you using sepolia or other testnet";
```


To start truffle development server (skip if you use sepolia)  

```bash
  npx truffle develop
```

To compile the solidity smart contract, run

```bash
  npx truffle compile
```

deploy smart contract to truffle test net 

```bash
  npx truffle migrate --network development
```
### For sepolia Test net

Change the sepolia section in 'truffle-config.js'

```javascript
const HDWalletProvider = require("@truffle/hdwallet-provider");
const sepoliaTestNetUrl="Paste your sepolia test net url";
const MEMONEIC="Paste your wallet secret phrase if you using sepolia or other testnet";

module.exports = {
  networks: {
    development: {
      host: "http://127.0.0.1",
      port: 9545,
      network_id: "1337", 
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
  }

```

Variables to modify

- sepoliaTestNetUrl
- MEMONEIC
- 'from' key value in sepolia object


deploy smart contract to Sepolia Test net 

```bash
  npx truffle migrate --network sepolia
```
### Metamask Configuration

#### To configure Metamask for Truffle Test net read the following article


https://trufflesuite.com/docs/truffle/how-to/truffle-with-metamask/

#### For seploia read the following article

https://www.alchemy.com/overviews/how-to-add-sepolia-to-metamask

After configuring the Metamask wallet run the server

### Web3.storage account

#### The website uses IPFS Servers of Web3.storage

Web3.storage signup is completely free and provides 150 GB of storage space for free

The following article shows how to generate api key

https://web3.storage/docs/how-tos/generate-api-token/

use your web3.storage api key in 'src/store/store.js'

```javascript
...

export const Store = defineStore('Store',{
  state: () => ({
    account:null,
    files: [],
    Metamask:false,
    isAuth:false,
    key:null,
    dfile:null,
    ipfs:"Paste your web3.storage api key here"
  }),

...

```

use api key in 'ipfs' key value


#### Start the server

```bash
  npm run dev
```
 and localhost at port number  3000
```bash
  http://127.0.0.1:3000
```



## License

[MIT](https://choosealicense.com/licenses/mit/)

