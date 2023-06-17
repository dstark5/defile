<template>
    <div class="w-full h-screen flex flex-col px-5 py-5 overflow-y-scroll">
        <h2 class="text-white font-bold mb-1 mt-3">
            Why this website exists ?
        </h2>
        <div class="bg-gray-600 p-2 rounded-sm">
            <p class="text-xs text-gray-300 p-1 tracking-wide leading-5 text-left">
                In IPFS file storage peers there is no encryption for files exist . 
                So the files stored in IPFS can be viewed by the IPFS peers and anybody with the 
                IPFS file hash can view or download the file from IPFS . This is good for file sharing 
                but when a user want to store file in a secure decentralized way this website comes in handy.
            </p>
        </div>
        <h2 class="text-white font-bold mt-7 mb-1">
            How this website works ?
        </h2>
        <div class="bg-gray-600 p-2 rounded-sm">
            <p class="text-xs text-gray-300 p-1 tracking-wide leading-5 text-left">
                This website stores your files in IPFS in the encrypted format . The encryption and decryption of file is 
                handled by the website . As IPFS and blockchain is decentralized the encryption and decryption process of data and 
                files taken place in the browser . The files you upload are encrypted with the Metamask encryption key which is unique 
                for every Ethereum account . The Encryption key is only given by the Metamask wallet if you have access to 
                the particular Ethereum account . This encryption key is used to store your IPFS file hash and file info in 
                the Ethereum blockchain in encrypted format so the hash and file info can only be decrypted by you when you 
                have access to the Etherum account . Similarly the files you upload to the IPFS are encrypted with the encryption 
                key in the browser and the encrypted file are uploaded to IPFS and the file hash are stored to the blockchain in 
                encrypted format . The encrypted file can be downloaded and decrypted in the browser with the key . This is how this 
                website works.
            </p>
        </div>
    </div>
</template>