<!-- eslint-disable vue/multi-word-component-names -->
<template>
    <div>
        <div class="py-2 flex bg-[white] mx-4 mt-4 pl-2 rounded-lg">
            <router-link to="/" class="font-semibold text-3xl">
                <img src="@/assets/logo.png" class="w-40" />
            </router-link>
        </div>

        <nav class="pt-8 h-[calc(100vh-100px)] overflow-y-auto pb-10">
            <ul class="space-y-2">
                <li v-for="(tab, key) in tabs" :key="key">
                    <router-link 
                        :to="tab.link"
                        class="inline-flex items-center space-x-4 px-5 py-3 text-base w-full hover:text-blue-600 hover:bg-white"
                        :class="checkActiveRoute(tab.link) ? 'text-blue-600 bg-white font-medium' : 'text-white'"
                    >
                        <span>
                            <VueFeather v-if="tab.icon" :type="tab.icon" class="w-5" />
                        </span>
                        <span>{{ tab.title }}</span>
                    </router-link>
                </li>
                <li>
                    <a 
                        href="#" @click.prevent="logout"
                        class="inline-flex items-center space-x-4 px-5 py-3 text-base w-full text-white hover:text-blue-700 hover:bg-white"
                    >
                        <span>
                            <VueFeather class="w-5" type="log-out" />
                        </span>
                        <span>Logout</span>
                    </a>
                </li>
            </ul>
        </nav>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import VueFeather from 'vue-feather'
import { useRoute } from 'vue-router';
import { useFirebaseAuth } from '../composables/useFirebaseAuth';

const route = useRoute()
const checkActiveRoute = link => {
    return '/' + route.fullPath.split('/')[1] === link
}

const { handleSignOut } = useFirebaseAuth()
const tabs = ref([
    {
        title: 'Dashboard',
        link: '/',
        icon: 'home',
    },
    {
        title: 'Talents',
        link: '/talents',
        icon: 'users'
    },
    {
        title: 'Jobs',
        link: '/jobs',
        icon: 'briefcase'
    },
    {
        title: 'Industries',
        link: '/industries',
        icon: 'tag'
    },
    {
        title: 'Recruiters',
        link: '/recruiters',
        icon: 'layers'
    },
    {
        title: 'Categories',
        link: '/categories',
        icon: 'tag'
    },
    {
        title: 'Faqs',
        link: '/faqs',
        icon: 'book'
    },
])

const logout = () => {
    handleSignOut()
}
</script>