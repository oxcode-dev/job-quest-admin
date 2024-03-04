<!-- eslint-disable vue/valid-template-root -->
<template>
    <Modal :show="show" @close="close" max-width="md">
        <div class="px-4 py-2 pb-24">
            <div class="flex justify-between items-center">
                <h2 class="text-lg font-semibold">
                    {{ props.industry && props.industry.id ? 'Edit Industry' : 'Add Industry' }}
                </h2>
                <button @click="close" v-html="closeIcon"></button>
            </div>
            <div class="my-6">
                <form @submit.prevent="submit">
                    <div>
                        <label class="font-semibold text-sm text-gray-600 pb-1 block">Name</label>
                        <input required v-model="form.name" class="border rounded-lg px-3 py-2 mt-1 mb-5 text-sm w-full" />
                    </div>

                    <div>
                        <label class="font-semibold text-sm text-gray-600 pb-1 block">Icon</label>
                        <div class="mt-1 mb-5 relative group">
                            <button type="button" @click="showDropdown = !showDropdown"  class="inline-flex justify-between w-full p-2 text-xs text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none">
                                <span class="mr-2" v-if="!form.icon">Open Dropdown</span>
                                <span 
                                    v-if="form.icon"
                                    class="text-gray-500 inline-flex items-center space-x-2 hover:bg-gray-100 p-1 cursor-pointer" 
                                >
                                    <VueFeather :type="form.icon" class="w-4" />
                                    <span class="capitalize">{{ form.icon }}</span>
                                </span>
                                <VueFeather class="w-4" type="chevron-down" />
                            </button>
                            <div id="dropdown-menu" :class="showDropdown ? 'flex' : 'hidden'" class="flex-col w-full h-28 overflow-y-auto absolute right-0 mt-2 rounded-md shadow-lg bg-white p-2 space-y-1">
                                <a 
                                    class="text-gray-500 inline-flex items-center space-x-2 hover:bg-gray-100 p-1 cursor-pointer" 
                                    href="#" @click="form.icon = icon; showDropdown = false"
                                    v-for="(icon, key) in icons" :key="key"
                                >
                                    <VueFeather :type="icon" class="w-4" />
                                    <span class="capitalize text-xs">{{ icon }}</span>
                                </a>
                            </div>
                        </div>
                    </div>

                    <button :disabled="isLoading" type="submit" class="transition duration-200 bg-blue-700 hover:bg-blue-600 focus:bg-blue-700 focus:shadow-sm focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50 text-white w-full py-2.5 rounded-lg text-sm shadow-sm hover:shadow-md font-semibold text-center inline-block">
                        <span>{{ isLoading ? 'Loading...' : 'Submit' }}</span>
                    </button>
                </form>
            </div>
        </div>
    </Modal>
</template>

<script setup>
import feather from 'feather-icons';
import VueFeather from 'vue-feather'
import Modal from '../components/Modal.vue';
import { computed, ref } from 'vue';
import { useIndustriesStore } from '../stores/industries'
import { useFirebaseDB } from '../composables/useFirebaseDB'

import { slugify } from '../helpers/index.js';

const { updateData, addData } = useFirebaseDB()
const icons = Object.keys(feather.icons);
const industriesStore = useIndustriesStore()
const closeIcon = ref(`<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>`)
const props = defineProps({
    show: {
        type: Boolean,
        default: () => false,
    },
    industry: {
        type: Object,
        default: () => {}
    }
})
const emit = defineEmits(['close', 'alert'])
const form = ref(props.industry && props.industry.id ? JSON.parse(JSON.stringify(props.industry)) : {
    name: '',
    icon: null,
})

const slugifyName = computed(() => slugify(form.value.name))

const isLoading = ref(false)
const showDropdown = ref(false)

const close = () => {
    if (props.show) {
        emit('close', false)
    }
}

const submit = async() => {
    if(form.value.name && form.value.icon) {
        isLoading.value = true
        form.value.slug = slugifyName.value
        if(props.industry && props.industry.id) {
            await updateData('industries', form.value, props.industry.id)
        }
        else {
            await addData('industries', form.value)
        }
        await industriesStore.fetchIndustries()
        isLoading.value = false
        emit('alert', true)
        close()
    }
}

</script>