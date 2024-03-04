<!-- eslint-disable vue/multi-word-component-names -->
<template>
    <AuthLayout>
        <div class="w-full md:max-w-sm">
            <form @submit.prevent="submit" class="w-full">
                <div class="py-1">
                    <h3 class="text-xl md:text-3xl text-gray-800 font-semibold">
                        Join Now
                    </h3>
                    <p class="text-sm text-gray-500 py-4 pt-2">
                        Stay updated to our job opportunities and get productive.
                    </p>
                </div>
                <p v-if="error" class="text-xs text-red-500 pb-4">
                    {{ error }}
                </p>
                <div class="py-1">
                    <label class="text-sm font-medium text-gray-500">Email</label>
                    <input :class="inputClass" type="email" v-model="form.email" required />
                </div>
                <div class="py-1">
                    <label class="text-sm font-medium text-gray-500">Password</label>
                    <div :class="inputClass" class="relative">
                        <input required v-model="form.password" class="w-full h-full bg-transparent focus:outline-none pr-8" :type="isPassword ? 'password' : 'text'" />
                        <a href="#" class="absolute top-3 text-gray-500 right-2" @click="isPassword = !isPassword">
                            <VueFeather :type="isPassword ? 'eye' : 'eye-off'" class="w-6" />
                        </a>
                    </div>
                </div>
                
                <div class="py-1 flex justify-end">
                    <div class="py-2 px-4 text-center space-x-1 text-sm text-gray-700">
                        <span>By clicking Agree & Join, you agree to the JoinQuest</span>
                        <nuxt-link to="#" class="text-blue-600 underline ">Term & Condition</nuxt-link>
                    </div>
                </div>
                <div class="py-4 font-semibold">
                    <button class="bg-blue-600 text-white px-4 py-3 w-full rounded">
                        <span v-if="!isLoading">
                            <span class="inline-block mr-2">Agree & Join</span>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-4 h-4 inline-block">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                        </span>
                        <span v-else>
                            Loading...
                        </span>
                    </button>
                </div>
                <div class="py-2 flex justify-center space-x-1 text-sm text-gray-700">
                    <span>Already on JobQuest?</span>
                    <router-link to="/login" class="text-blue-600 underline ">Log In</router-link>
                </div>
            </form>
        </div>
    </AuthLayout>
    
</template>

<script setup>
import VueFeather from 'vue-feather'
import AuthLayout from '@/layout/auth.vue'
import { ref, onBeforeMount } from "vue";
import { auth } from '../firebase.config';
import { onAuthStateChanged } from "firebase/auth";
import router from "../router";
import { useAuthStore } from "../stores/auth";
import { useFirebaseAuth } from "../composables/useFirebaseAuth";

const authStore = useAuthStore()

const inputClass = ref('block w-full h-12 bg-gray-100 border rounded border-gray-200 my-1 p-2 focus:outline-none')
const isPassword = ref(true)

const {error, isLoading, handleSignUp} = useFirebaseAuth()

const form = ref({
    email: null,
    password: null,
})

async function submit() {
    handleSignUp(form.value.email, form.value.password)
}

onBeforeMount(() => {
    onAuthStateChanged(auth, (user) => {
        if(user && user.uid !== '') {
            authStore.saveAuthUser(user)
            router.push('/')
        }
    })
})
</script>