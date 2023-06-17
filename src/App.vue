<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <div class="min-h-screen flex flex-row bg-gray-700">
  <div class="flex flex-col w-1/4 min-w-[250px] bg-gray-800 overflow-hidden">
    <div class="flex items-center justify-center h-20 shadow-lg">
    <img class="flex h-6 mr-1" src="./assets/storage.png">
      <h1 class="text-xl font-semibold text-white">DeFile</h1>
    </div>
    <ul class="flex flex-col py-4">
      <li>
        <RouterLink to="/" class="flex flex-row items-center justify-center h-12 text-white hover:text-gray-300">
          <span><img class="w-4 mr-2" src="./assets/folder.svg"></span>
          <span class="text-sm font-semibold text-gray-300">My Files</span>
        </RouterLink>
      </li> 
      <li>
        <RouterLink to="/upload" class="flex flex-row items-center justify-center h-12 text-white hover:text-gray-300">
          <span><img class="w-4 mr-2" src="./assets/upload.svg"></span>
          <span class="text-sm font-semibold text-gray-300">Upload</span>
        </RouterLink>
      </li> 
      <li>
        <RouterLink to="/about" class="flex flex-row items-center justify-center h-12 text-white hover:text-gray-300">
          <span><img class="w-4 mr-2" src="./assets/info.svg"></span>
          <span class="text-sm font-semibold text-gray-300">About</span>
        </RouterLink>
      </li> 
    </ul>
  </div>
  <div class="w-full ">
    <RouterView class="px-40"/>
  </div>
</div>
</template>