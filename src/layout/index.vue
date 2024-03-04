<!-- eslint-disable vue/multi-word-component-names -->
<template>
    <div class="absolute h-screen w-full bg-blue-50 overflow-hidden">
        <section class="h-full">
            <div class="opacity-75 z-[510] h-full w-full bg-gray-700 fixed" :class="showSidebar ? 'flex sm:hidden' : 'hidden'" @click="showSidebar = false"></div>
            <aside 
                :class="showSidebar ? 'flex' : 'hidden sm:flex'" 
                class="h-full w-[270px] border-r shadow-md bg-blue-700 z-[550] fixed top-0"
            >
                <a href="#" class="md:hidden absolute right-6 top-6" @click="showSidebar = false">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                </a>
                <Sidebar class="w-full" />
            </aside>
            <main class="px-0 w-full md:w-auto">
                <div class="shadow z-[500] right-0 w-full h-20 top-0" :class="!showSidebar ? 'absolute' : 'fixed'">
                    <div class="bg-white w-full h-full relative">
                        <a href="#" class="md:hidden absolute left-4 top-8" @click="showSidebar = true">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 5.25h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5" /></svg>
                        </a>
                        <Header></Header>
                    </div>
                </div>
                <div class="md:pl-[310px] pt-32 overflow-y-auto h-screen md:px-10 md:pl-2 px-4 pr-8">
                    <div class="mt-6 mb-16">
                        <slot></slot>
                    </div>
                </div>
            </main>
        </section>
        <RegisterCompleteForm 
            :user="user_details" 
            :show="!verifyUser" 
            @alert="showAlert = $event"
        />
        <NotificationBar 
            :active="showAlert"
            @close="showAlert = $event"
        />
    </div>
</template>

<script setup>
import Sidebar from './sidebar.vue';
import Header from './header.vue';
import { computed, onBeforeMount, ref } from 'vue';
import { onAuthStateChanged } from "firebase/auth";
import { useAuthStore } from '../stores/auth';
import { useFirebaseDB } from '../composables/useFirebaseDB';
import { auth } from '../firebase.config';
import { o_O } from '../helpers';
import RegisterCompleteForm from '../forms/RegisterCompleteForm.vue';
import NotificationBar from '../components/NotificationBar.vue';

const showSidebar = ref(false)
const authStore = useAuthStore()
const { getDataWhereKeyValue } = useFirebaseDB()

const user_details = computed(() => authStore.getUserDetails)
const verifyUser = computed(() => {
    const hasName = !!user_details.value?.name //|| user_details.value.hasOwnProperty('name');
    const hasPhone = !!user_details.value?.phone //|| user_details.value.hasOwnProperty('phone');
    return hasName && hasPhone
})
const showAlert = ref(false)
onBeforeMount(() => {
    onAuthStateChanged(auth, async (user) => {
        if(user && user.uid !== '') {
            let [error, data] = await o_O(getDataWhereKeyValue('users', 'uid', user.uid))
            if(error || data.length < 1) {
                // console.log(error)
                return authStore.saveAuthUserDetail({})
            }
            authStore.saveAuthUserDetail(data[0])
        }
    })
})
</script>