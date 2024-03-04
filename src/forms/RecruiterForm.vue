<!-- eslint-disable vue/valid-template-root -->
<template>
    <Modal :show="show" @close="close" max-width="md">
        <div class="px-4 py-2">
            <div class="flex justify-between items-center">
                <h2 class="text-lg font-semibold">
                    {{ props.recruiter && props.recruiter.id ? 'Edit Recruiter' : 'Add Recruiter' }}
                </h2>
                <button @click="close" v-html="closeIcon"></button>
            </div>
            <div class="my-6">
                <form @submit.prevent="submit">
                    <div>
                        <label class="font-semibold text-sm text-gray-600 pb-1 block">Name</label>
                        <input required v-model="form.name" class="border rounded-lg px-3 py-2 mt-1 mb-3 text-sm w-full" />
                    </div>
                    <div>
                        <label class="font-semibold text-sm text-gray-600 pb-1 block">Email</label>
                        <input required type="email" v-model="form.email" class="border rounded-lg px-3 py-2 mt-1 mb-3 text-sm w-full" />
                    </div>
                    <div>
                        <label class="font-semibold text-sm text-gray-600 pb-1 block">Phone</label>
                        <input required name="phone" v-model="form.phone" class="border rounded-lg px-3 py-2 mt-1 mb-3 text-sm w-full" />
                    </div>

                    <div>
                        <label class="font-semibold text-sm text-gray-600 pb-1 block">Industry</label>
                        <select required v-model="form.industry_id"  class="border rounded-lg px-3 py-2 mt-1 mb-3 text-sm w-full" >
                            <option :value="industry.id" v-for="(industry, key) in industries" :key="key">
                                {{ industry.name }}
                            </option>
                        </select>
                    </div>

                    <div>
                        <label class="font-semibold text-sm text-gray-600 pb-1 block">Location</label>
                        <textarea required v-model="form.location" class="border rounded-lg px-3 py-2 mt-1 mb-3 text-sm w-full"></textarea>
                    </div>

                    <div>
                        <label class="font-semibold text-sm text-gray-600 pb-1 block">Bio</label>
                        <textarea required v-model="form.bio" class="border rounded-lg px-3 py-2 mt-1 mb-3 text-sm w-full"></textarea>
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
import Modal from '../components/Modal.vue';
import { ref, computed } from 'vue';
import { useFirebaseDB } from '../composables/useFirebaseDB'
import { serverTimestamp } from 'firebase/firestore';
import { useIndustriesStore } from '../stores/industries'

const closeIcon = ref(`<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>`)
const props = defineProps({
    show: {
        type: Boolean,
        default: () => false,
    },
    recruiter: {
        type: Object,
        default: () => {}
    }
})
const emit = defineEmits(['close', 'alert'])
const form = ref(props.recruiter && props.recruiter.id ? JSON.parse(JSON.stringify(props.recruiter)) : {
    name: '',
    email: '',
    phone: '',
    industry_id: null,
    location: '',
    bio: '',
    logo: '',
})

const industriesStore = useIndustriesStore()
const industries = computed(() => industriesStore.getIndustries || [])

const { addData, updateData } = useFirebaseDB()

const isLoading = ref(false)

const close = () => {
    if (props.show) {
        emit('close', false)
    }
}

const submit = async() => {
    if(form.value.name && form.value.email && form.value.phone) {
        isLoading.value = true
        if(props.recruiter && props.recruiter.id) {
            form.value.updated_at = serverTimestamp()
            await updateData('recruiters', form.value, props.recruiter.id)
        }
        else {
            form.value.created_at = serverTimestamp()
            form.value.updated_at = serverTimestamp()
            await addData('recruiters', form.value)
        }
        isLoading.value = false
        emit('alert', true)
        close()
    }
}

</script>