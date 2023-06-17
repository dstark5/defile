<script>
import Card from '@/components/Card.vue';
import { Store } from '../store/store';
import { toRaw } from "vue";
const state=Store()
export default {
  data(){
    return{
      data:null,
      loading:true,
      downloading:false,
      progress:"width:0%",
      decrypting:false,
      decrypted:false
    }
  },
  components: {
    Card
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
    decryptfile:async function(objFile){
      var cipherbytes=await this.fileToArrayBuffer(objFile)
      .catch(function(err){
        console.error(err);
      });	
      var cipherbytes=new Uint8Array(cipherbytes);

      var pbkdf2iterations=10000;
      var passphrasebytes=new TextEncoder("utf-8").encode(state.key);
      var pbkdf2salt=cipherbytes.slice(8,16);


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
      cipherbytes=cipherbytes.slice(16);

      var key=await window.crypto.subtle.importKey('raw', keybytes, {name: 'AES-CBC', length: 256}, false, ['decrypt']) 
      .catch(function(err){
        console.error(err);
      });		

      var plaintextbytes=await window.crypto.subtle.decrypt({name: "AES-CBC", iv: ivbytes}, key, cipherbytes)
      .catch(function(err){
        console.error(err);
      });

      if(!plaintextbytes) {
        return;
      }

      plaintextbytes=new Uint8Array(plaintextbytes);

      var blob=new Blob([plaintextbytes],{type: 'application/download'});
      await new Promise(r => setTimeout(r, 3000))
      this.decrypted=true
      await new Promise(r => setTimeout(r, 2000))
      this.downloading=false
      this.decrypting=false
      var blobUrl=URL.createObjectURL(blob);
      window.location.replace(blobUrl)
    },

    downloadFile:async function(hash,fname){
      this.downloading=true
      this.fname=fname
      var url=`https://ipfs.io/ipfs/${hash}`

      var progress=({loaded,total})=>{
        var percentage=parseInt(loaded/total*100)
        this.progress=`width:${percentage}%`
      }
      try{
        //copy url to clipboard
        navigator.clipboard.writeText(url)
      }catch(err){return}
      //downloading the encrypted file from ipfs
      const response = await fetch(url);
      const contentLength = response.headers.get('content-length');
      const total = parseInt(contentLength, 10);
      let loaded = 0;
      const resp = new Response(new ReadableStream({
        async start(controller) {
          const reader = response.body.getReader();
          for (;;) {
            const {done, value} = await reader.read();
            if (done) break;
            loaded += value.byteLength;
            progress({loaded,total})
            controller.enqueue(value);
          }
          controller.close();
        },
      }));

      const blob = await resp.blob();
      var fileBlob = new File([blob],fname,{ lastModified: new Date().getTime()})
      this.decrypting=true
      //decrypting the encrypted downloaded file
      await this.decryptfile(fileBlob)
    }
  },
  async created() {
    await state.loadWeb3()
    await state.loadData()
    var data=toRaw(state.getFiles)
    this.data=data
    this.loading=false
  }
}
</script>

<template>
  <div v-if="loading==true" class="w-full h-full flex flex-col justify-center items-center ">
    <div  class="w-[75px]">
      <img src="../assets/loading.svg" alt="loading">
    </div>
  </div>
  <div v-else-if="data.length==0 && loading==false" class="w-full h-full flex flex-col justify-center items-center">
    <img class="flex w-24 h-24" src="../assets/leaf.png">
      <h5 class="mt-8 text-sm font-bold text-gray-100">
        No Files Found 
      </h5>
  </div>
  <div v-else-if="downloading==true" class="w-full h-full flex flex-col justify-center items-center ">
    <div class="text-center">
      <h2 class="mb-8 text-xl font-bold text-white">
       Downloading
      </h2>
    </div>
    <div class="w-1/2 mb-6 bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
      <div class="bg-blue-600 h-2.5 rounded-full" :style="progress"></div>
    </div>
    <p class="text-sm mb-2 text-center text-gray-200">
        {{fname}}
    </p>
    <p class="text-xs text-center text-gray-300">
        Don't refresh page while downloading
    </p>
    <div v-if="decrypting" class="flex flex-row justify-center items-center">
      <h2 class="pt-8 text-lg font-bold text-white">
       Decrypting
      </h2>
      <img v-if="decrypted==false" class="ml-2 mt-8 w-6 h-6" src="../assets/loading.svg" alt="loading">
      <img v-if="decrypted==true" class="ml-2 mt-8 w-6 h-6" src="../assets/yes.svg" alt="yes">
    </div>
  </div>
  <div v-else class="container w-full h-screen flex flex-col overflow-y-scroll px-14">
    <h2 class="mt-5 text-xl font-bold text-white">
       Files
    </h2>
    <div class="flex flex-col">
        <Card v-for="d in data" :fileName="d.fileName" :fileSize="d.fileSize" :fileType="d.fileType" @click.native="downloadFile(d.fileHash,d.fileName,d.fileType)" />
    </div>
  </div>
</template>
