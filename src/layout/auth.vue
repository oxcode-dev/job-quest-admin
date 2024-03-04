<!-- eslint-disable vue/multi-word-component-names -->
<template>
    <div class="w-full">
        
        <div class="flex h-screen overflow-hidden">
            <div class="hidden md:flex w-1/2 relative overflow-hidden">
                <img :src="img" class="object-cover" />
                <div class="absolute bg-gradient-to-t from-15% from-black via-gray-500/50 to-gray-300/50 w-full h-full"></div>
                <div class="absolute p-10">
                    <div class="w-40">
                        <nuxt-link to="/">
                            <img src="../assets/logo.png" alt="JobQuest Logo" />
                        </nuxt-link>
                    </div>
                </div>
                <div class="absolute bottom-40 left-16 text-white">
                    <h2 class="text-lg leading-normal font-semibold md:text-[30px] capitalize ">
                        Looking for a job better opportunity?
                    </h2>
                </div>
            </div>
            <div class="w-full md:w-1/2 h-screen overflow-y-scroll">
                <div class="w-full p-6 pt-32 flex flex-col items-center">
                    <div class="w-40 md:hidden">
                        <router-link to="/">
                            <img src="../assets/logo.png" alt="JobQuest Logo" />
                        </router-link>
                    </div>
                    <slot />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from "vue"
const img = ref('https://www.templars-law.com/app/uploads/2023/02/Decentralization-Of-The-Anti-Corruption-Fight-In-Nigeria_-A-Review-Of-The-Lagos-State-Public-Complai...-aspect-ratio-848-477.jpg')
</script>