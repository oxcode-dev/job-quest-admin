<!-- eslint-disable vue/valid-template-root -->
<template>
    <Modal :show="show" @close="close" max-width="md">
        <div class="px-4 py-2">
            <div class="flex justify-between items-center">
                <h2 class="text-lg font-semibold pt-2">
                    Kindly Complete Your Registration
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
                        <label class="font-semibold text-sm text-gray-600 pb-1 block">Phone</label>
                        <input required name="phone" v-model="form.phone" class="border rounded-lg px-3 py-2 mt-1 mb-5 text-sm w-full" />
                    </div>

                    <div>
                        <label class="font-semibold text-sm text-gray-600 pb-1 block">Location</label>
                        <input required name="address" v-model="form.location" class="border rounded-lg px-3 py-2 mt-1 mb-5 text-sm w-full" />
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
import { computed, ref } from 'vue';
import { useAuthStore } from '../stores/auth'
import { useFirebaseDB } from '../composables/useFirebaseDB'
import { o_O } from '../helpers';

const { updateData, getDataWithId } = useFirebaseDB()
const authStore = useAuthStore()

const closeIcon = ref(`<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>`)
const props = defineProps({
    show: {
        type: Boolean,
        default: () => false,
    },
    user: {
        type: Object,
        required: true,
    }
})
const emit = defineEmits(['close', 'alert'])
const form = ref({
    name: '',
    phone: '', 
    location: '',
})

const isLoading = ref(false)

const submit = async() => {
    if(form.value.name) {
        isLoading.value = true
        let [error, data] = await o_O(updateData('users', form.value, props.user.id))
        if(!error) {
            let [err, detail] = await o_O(getDataWithId('users', props.user.id))
            if(!err && detail) {
                authStore.saveAuthUserDetail(detail)
            }
            emit('alert', true)
        }
        isLoading.value = false
    }
}

</script>