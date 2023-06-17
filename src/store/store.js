import { defineStore } from 'pinia';
import DFile from '../../build/contracts/DFile.json';
import Web3 from 'web3';
import { toRaw } from "vue";
import AES from 'crypto-js/aes';
import Utf8 from 'crypto-js/enc-utf8';
import sha256 from 'crypto-js/sha256'
import hex from 'crypto-js/enc-hex';

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
  getters: {
    getFiles: (state) => {
      return state.files;
    }
  }, 
  actions: {
    async loadWeb3(){
      if (window.ethereum) {
        try{
          window.web3 = new Web3(window.ethereum)
          this.Metamask=true;
          await window.ethereum.request({ method: 'eth_requestAccounts' });
          this.isAuth=true;
        }catch(err){
          console.log(err)
          this.isAuth=false;
        }
      }
      // else if (window.web3) {
      //   console.log("window.web3")
      //   window.web3 = new Web3(window.web3.currentProvider)
      //   this.Metamask=true;
      // }
      else {
        this.Metamask=false;
        this.isAuth=false;
      }
    },
    async loadData(){
      try{
        const web3 = window.web3
        const accounts = await web3.eth.getAccounts()
        this.account=accounts[0]
        const networkId = await web3.eth.net.getId()
        const networkData = DFile.networks[networkId]
        if(networkData) {
          const dfile = new web3.eth.Contract(DFile.abi, networkData.address)
          this.dfile=dfile;
          this.accEvent()
          const filesCount = await dfile.methods.fileCount().call()
          if(this.key==null){
            var storeData=this.getData();
            if(storeData!=null && storeData.account==this.account){
              this.key=storeData.key;
            }else{
              await this.getKey()
              this.setData(this.account,this.key); 
            }
          }
          if(filesCount!=this.files.length){
            for (var i = filesCount; i >= 1; i--) {
              const file = await dfile.methods.files(i).call()
              if(file.uploader==this.account){
                var hash=this.decrypt(file.fileHash)
                var data={
                  fileId:file.fileId,
                  fileHash:hash,
                  fileName:file.fileName,
                  fileSize:file.fileSize,
                  fileType:file.fileType,
                  uploader:file.uploader,
                  uploadTime:file.uploadTime
                }
                var files=toRaw(this.files)
                var filter=files.filter(f=>f.fileHash==data.fileHash)
                if(filter.length==0){
                  this.files.push(data)
                }
              }
            }
          }
        } else {
          alert('DFile contract not deployed to detected network.')
        }
      }catch(err){
        alert(err)
      }
    },
    loadIPFS(){
      // this.ipfs= create({url:"https://ipfs-gateway.cloud/api/v0"})
    },
    async getKey(){
     await window.ethereum
        .request({
          method: 'eth_getEncryptionPublicKey',
          params: [this.account],
        })
        .then((result) => {
          const hashDigest = sha256(result);
          this.key=hashDigest.toString(hex);
        })
        .catch(err=>console.log(err))
    },
    encrypt(msg){
      var encrypted = AES.encrypt(msg,this.key).toString();
      return encrypted;
    },
    decrypt(hash){
      var bytes  = AES.decrypt(hash, this.key);
      const decrypted = bytes.toString(Utf8);
      return decrypted;
    },
    setData(account,key){
      var data={"account":account,"key":key};
      localStorage.setItem("apiData", JSON.stringify(data));
    },
    getData(){
      var data = JSON.parse(localStorage.getItem("apiData"));
      return data;
    },
    accEvent(){
      window.ethereum.on('accountsChanged', function (accounts) {
        window.location.reload()
      })
      window.ethereum.on('chainChanged', function (networkId) {
         window.location.reload()
      })
    }
  }
})
