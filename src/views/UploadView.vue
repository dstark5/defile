<script>
import { Store } from '../store/store';
import { Web3Storage } from 'web3.storage';
import axios from 'axios';
const state=Store()

export default {
  data(){
    return{
      file:null,
      uploading:false,
      fileName:"file",
      progress:"width:0%",
      encryptedProg:false
    }
  },
  methods:{
    fileToArrayBuffer:function(file){
      return new Promise((resolve, reject) => {
        var fr = new FileReader();  
        fr.onload = () => {
          resolve(fr.result )
        };
        fr.readAsArrayBuffer(file);
      });
    },

    encryptblob:async function(objFile){
      var plaintextbytes=await this.fileToArrayBuffer(objFile).catch(function(err){console.error(err);});	
      var plaintextbytes=new Uint8Array(plaintextbytes);
      var pbkdf2iterations=10000;
      var passphrasebytes=new TextEncoder("utf-8").encode(state.key);
      var pbkdf2salt=window.crypto.getRandomValues(new Uint8Array(8));
      var passphrasekey=await window.crypto.subtle.importKey('raw', passphrasebytes, {name: 'PBKDF2'}, false, ['deriveBits'])
      .catch(function(err){
        console.error(err);
      });

      var pbkdf2bytes=await window.crypto.subtle.deriveBits({"name": 'PBKDF2', "salt": pbkdf2salt, "iterations": pbkdf2iterations, "hash": 'SHA-256'}, passphrasekey, 384)		
      .catch(function(err){
        console.error(err);
      });
      pbkdf2bytes=new Uint8Array(pbkdf2bytes);

      var keybytes=pbkdf2bytes.slice(0,32);
      var ivbytes=pbkdf2bytes.slice(32);

      var key=await window.crypto.subtle.importKey('raw', keybytes, {name: 'AES-CBC', length: 256}, false, ['encrypt']) 
      .catch(function(err){
        console.error(err);
      });	

      var cipherbytes=await window.crypto.subtle.encrypt({name: "AES-CBC", iv: ivbytes}, key, plaintextbytes)
      .catch(function(err){
        console.error(err);
      });
      cipherbytes=new Uint8Array(cipherbytes);
      var resultbytes=new Uint8Array(cipherbytes.length+16)
      resultbytes.set(new TextEncoder("utf-8").encode('Salted__'));
      resultbytes.set(pbkdf2salt, 8);
      resultbytes.set(cipherbytes, 16);
      var blob=new Blob([resultbytes]);
      await new Promise(r => setTimeout(r, 3000))
      this.encryptedProg=true
      await new Promise(r => setTimeout(r, 2000))
      return blob;
    },

    fileToBuffer:async function(e){
      //getting the selected file and info
      this.file = e.target.files
      this.fileName=this.file[0].name
      this.fileSize=this.file[0].size
      this.fileType=this.file[0].type

      // this.blob=new Blob(this.file)
      // this.encrypted=await this.encryptblob(this.blob)      
      // this.file=this.fileBlob
    },

    onUploadProgress:function(prog){
      var x=parseInt(prog.loaded/prog.total*100);
      this.progress=`width:${x}%`;
    },
    
    uploadFile:async function(e){
      e.preventDefault();
      this.ipfs=new Web3Storage({ token:state.ipfs})
      if(this.file!=null){
        this.uploading= true
        console.log("Encrypting file")
        //encrypting the selected file before upload
        this.encrypted=await this.encryptblob(this.file[0])
        //encrypted blob to file
        this.file = new File([this.encrypted], this.fileName,{ lastModified: new Date().getTime(), type: this.file[0].type })
        //uploading encrypted file to ipfs
        var upload=await axios({
          method: 'post',
          url: 'https://api.web3.storage/upload',
          data: this.file,
          headers: {'Authorization': `Bearer ${state.ipfs}`,
          "Content-Type": "multipart/form-data","Content-Type":this.file.type},
          onUploadProgress:this.onUploadProgress
        })
        var cid=upload.data.cid
        //Encryption of CID
        cid=state.encrypt(cid);
        this.uploading= !true

        //storing file info to eth
        state.dfile.methods.uploadFile(cid, this.fileSize, this.fileType, this.fileName)
        .send({ from: state.account }).on('transactionHash', (hash) => {
          console.log("data stored")
         window.location.reload()
        }).on('error', (e) =>{
          window.alert('Error')
        })
      }else{
        window.alert('Select a file to upload!')
      }
    }
  },
  async created(){
    await state.loadWeb3()
    await state.loadData()
  }
}
</script>

<template>
  <main v-if="uploading!=true">
    <div class="sm:max-w-lg w-full p-10 bg-gray-700 rounded-xl z-10">
    <div class="text-center">
      <h2 class="mt-1 text-3xl font-bold text-white">
       Upload 
      </h2>
    </div>
        <form class="mt-1 pt-3 space-y-1">
              
          <div class="grid grid-cols-1 space-y-1">
            <div class="flex items-center justify-center w-full">
              <label class="flex flex-col rounded-lg border-4 border-gray-400 border-dashed w-full min-w-[450px] h-50 p-10 group text-center">
                  <div class="h-full w-full text-center flex flex-col items-center justify-center items-center  ">
                      <div class="flex flex-auto max-h-40 w-2/5 mx-auto -mt-13 mb-1">
                      <img class="has-mask h-28 object-center rounded-sm" src="../assets/upload.jpg" alt="upload image">
                      </div>
                      <p class="pointer-none text-gray-100 "><span class="text-sm">Drag and drop</span> files here <br /> or <span  class="text-blue-400 hover:underline">select a file</span> from your computer</p>
              </div>
                      <input type="file" @change="fileToBuffer" class="hidden"/>
                    </label>
                </div>
            </div>
                    <p class="text-sm text-gray-300">
                        <span>File type: doc,pdf,types of images</span>
                    </p>
            <div class="flex justify-center">
                <button type="submit" @click="uploadFile" class="my-2 w-1/2 min-w-[200px] flex justify-center bg-blue-700 text-gray-50 p-4  rounded-full tracking-wide font-semibold  focus:outline-none focus:shadow-outline hover:bg-blue-600 shadow-lg cursor-pointer transition ease-in duration-300">
                Upload
            </button>
            </div>
        </form>
  </div>
  </main>
  <div class="w-full h-full flex flex-col justify-center items-center" v-else>
    <div class="flex flex-row justify-center items-center mb-4">
      <h2 class="pt-1 text-lg font-bold text-white">
       Encrypting
      </h2>
      <img v-if="encryptedProg==false" class="ml-2 w-6 h-6" src="../assets/loading.svg" alt="loading">
      <img v-if="encryptedProg==true" class="ml-2 w-6 h-6" src="../assets/yes.svg" alt="yes">
    </div>
   <div class="text-center">
      <h2 class="mb-8 text-xl font-bold text-white">
       Uploading
      </h2>
    </div>
    <div class="w-1/2 mb-6 bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
      <div class="bg-blue-600 h-2.5 rounded-full" :style="progress"></div>
    </div>
    <p class="text-sm mb-2 text-center text-gray-200">
        {{fileName}}
    </p>
    <p class="text-xs text-center text-gray-300">
        Don't refresh page while uploading
    </p>
  </div>
</template>
