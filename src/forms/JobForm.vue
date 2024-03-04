<!-- eslint-disable vue/valid-template-root -->
<template>
    <Modal :show="show" @close="close" max-width="md">
        <div class="px-4 py-2">
            <div class="flex justify-between items-center">
                <h2 class="text-lg font-semibold">
                    {{ props.job && props.job.id ? 'Edit Job' : 'Add Job' }}
                </h2>
                <button @click="close" v-html="closeIcon"></button>
            </div>
            <div class="my-6">
                <form @submit.prevent="submit">
                    <div>
                        <label class="font-semibold text-sm text-gray-600 pb-1 block">Title</label>
                        <input required v-model="form.title" class="border rounded-lg px-3 py-2 mt-1 mb-5 text-sm w-full" />
                    </div>

                    <div>
                        <label class="font-semibold text-sm text-gray-600 pb-1 block">Category</label>
                        <select required v-model="form.category_id" class="border rounded-lg px-3 py-2 mt-1 mb-5 text-sm w-full">
                            <option 
                                v-for="(category, key) in categories" :key="key"
                                :value="category.id"
                            >
                                {{ category.name }}
                            </option>
                        </select>
                    </div>

                    <div>
                        <label class="font-semibold text-sm text-gray-600 pb-1 block">Job Type</label>
                        <select required v-model="form.job_type" class="border rounded-lg px-3 py-2 mt-1 mb-5 text-sm w-full">
                            <option 
                                v-for="(type, key) in jobTypes" :key="key"
                                :value="type.value"
                            >
                                {{ type.label }}
                            </option>
                        </select>
                    </div>

                    <div>
                        <label class="font-semibold text-sm text-gray-600 pb-1 block">Location</label>
                        <input required type="text" v-model="form.location" class="border rounded-lg px-3 py-2 mt-1 mb-5 text-sm w-full" />
                    </div>

                    <div>
                        <label class="font-semibold text-sm text-gray-600 pb-1 block">Position Available</label>
                        <input required type="number" v-model.number="form.position_available" class="border rounded-lg px-3 py-2 mt-1 mb-5 text-sm w-full" />
                    </div>

                    <div>
                        <label class="font-semibold text-sm text-gray-600 pb-1 block">Salary (year)</label>
                        <div class="flex space-x-2">
                            <input required type="number" placeholder="min" v-model.number="form.min_salary" class="border rounded-lg px-3 py-2 mt-1 mb-5 text-sm w-full" />
                            <input required type="number" placeholder="max" v-model.number="form.max_salary" class="border rounded-lg px-3 py-2 mt-1 mb-5 text-sm w-full" />
                        </div>
                    </div>

                    <div>
                        <label class="font-semibold text-sm text-gray-600 pb-1 block">Description</label>
                        <textarea required v-model="form.description" class="border rounded-lg px-3 py-2 mt-1 mb-5 text-sm w-full h-24"></textarea>
                    </div>

                    <div>
                        <label class="font-semibold text-sm text-gray-600 pb-1 block">Responsibility</label>
                        <textarea required v-model="form.responsibility" class="border rounded-lg px-3 py-2 mt-1 mb-5 text-sm w-full h-24"></textarea>
                    </div>

                    <div>
                        <label class="font-semibold text-sm text-gray-600 pb-1 block">Qualification</label>
                        <textarea required v-model="form.qualification" class="border rounded-lg px-3 py-2 mt-1 mb-5 text-sm w-full h-24"></textarea>
                    </div>

                    <div>
                        <label class="font-semibold text-sm text-gray-600 pb-1 block">Benefits</label>
                        <textarea required v-model="form.benefits" class="border rounded-lg px-3 py-2 mt-1 mb-5 text-sm w-full h-24"></textarea>
                    </div>

                    <div>
                        <div class="flex items-center space-x-3">
                            <label class="font-semibold text-sm text-gray-600 pb-1 block">State</label>
                            <div class="flex space-x-2">
                                <input
                                    :value="form.isOpen"
                                    v-model="form.isOpen"
                                    :checked="form.isOpen"
                                    type="checkbox"
                                    class="appearance-none w-16 focus:outline-none checked:bg-blue-300 h-8 bg-gray-300 rounded-full before:inline-block before:rounded-full before:bg-white checked:before:bg-blue-500 before:h-8 before:w-8 checked:before:translate-x-full shadow-inner transition-all duration-300 before:ml-0.5"
                                />
                            </div>  
                        </div>
                        <p class="py-2 text-xs text-gray-500">
                            <span class="font-medium">Note: </span>
                            <span>This job would be {{ form.isOpen ? 'opened' : 'closed' }}</span>
                        </p>
                    </div>

                    <button :disabled="isLoading" type="submit" class="transition duration-200 bg-blue-700 hover:bg-blue-600 focus:bg-blue-700 focus:shadow-sm focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50 text-white w-full py-2.5 rounded-lg text-sm shadow-sm hover:shadow-md font-semibold text-center inline-block mt-6">
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
import { useCategoriesStore } from '../stores/categories';
import { serverTimestamp } from 'firebase/firestore';
import { jobTypes } from '../helpers/data'
import { useFirebaseDB } from '../composables/useFirebaseDB';

const categoriesStore = useCategoriesStore()
const { updateData, addData} = useFirebaseDB()

const categories = computed(() => categoriesStore.getCategories || [])

const closeIcon = ref(`<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>`)
const props = defineProps({
    show: {
        type: Boolean,
        default: () => false,
    },
    job: {
        type: Object,
        default: () => {}
    }, 
    recruiter: {
        type: String,
        default: () => null
    },
})
const emit = defineEmits(['close', 'alert'])

const form = ref(props.job.id ? JSON.parse(JSON.stringify(props.job)) : {
    title: '',
    category_id: '',
    isOpen: true,
    responsibility: null,
    job_type: null,
    description: '',
    created_at: '',
    updated_at: '',
    qualification: '',
    benefits: '',
    location: '',
    position_available: '',
    min_salary: '',
    max_salary: '',
    recruiter_id:  props.recruiter?.id || null,
})

const isLoading = ref(false)

const close = () => {
    if (props.show) {
        emit('close', false)
    }
}

const submit = async() => {
    if(form.value.title && form.value.category_id && form.value.job_type && form.value.location) {
        isLoading.value = true
        handleSubmit()
    }
}

const handleSubmit = async() => {
    if(props.job && props.job.id) {
        form.value.updated_at = serverTimestamp()
        await updateData('jobs', form.value, props.job.id)
    }
    else {
        form.value.created_at = serverTimestamp()
        form.value.updated_at = serverTimestamp()
        await addData('jobs', form.value)
    }
    isLoading.value = false
    emit('alert', true)
    close()
}

</script>