<script>
  export default {
    props: {
      fileName:String,
      fileSize:String,
      fileType:String
    },
    data(){
        return{
            icon:"/icons/"+this.fileName.split('.')[this.fileName.split('.').length-1]+".svg",
            size:this.getReadableFileSizeString(this.fileSize),
            name:this.fileNameTrim(this.fileName)
        }
    },
    methods:{
       getReadableFileSizeString:function(fileSizeInBytes){
          var i = -1;
          var byteUnits = [' kB', ' MB', ' GB', ' TB', 'PB', 'EB', 'ZB', 'YB'];
          do {
            fileSizeInBytes /= 1024;
            i++;
          } while (fileSizeInBytes > 1024);
          return Math.max(fileSizeInBytes, 0.1).toFixed(1) + byteUnits[i];
        },
        fileNameTrim:function(string){
            if(string.length<50){
                return string;
            }else{
                return `${string.substring(0,35)}...${this.fileName.split('.')[this.fileName.split('.').length-1]}`;     
            }
        }
    }
  }  
</script>

<template>
  <div class="flex flex-row">
            <div class="container bg-gray-100/[.07] w-11/12 h-16 flex flex-row items-center m-2 p-2 rounded-sm">
                <img class="h-14 w-auto p-3" :src="icon">
                <div class="flex flex-col">
                    <h5 class="text-sm">
                        <div class="no-underline text-white text-sm" >
                            {{name}}
                        </div>
                    </h5>
                    <div class="flex items-center no-underline text-gray-300 text-xs pt-1" >
                    <p class="text-xs">
                        {{size}}
                    </p>
                </div>
                </div>
            </div>
      </div>
</template>