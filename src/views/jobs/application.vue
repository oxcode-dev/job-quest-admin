<!-- eslint-disable vue/multi-word-component-names -->
<template>
    <Layout>
        <main class="rounded-lg bg-white text-slate-500 px-4 py-4">
            <div class="flex items-center justify-between px-2">
                <h2 class="text-2xl font-semibold text-slate-800">{{ job?.title || 'Job' }}</h2>
            </div>

            <div v-if="!isLoading && !isLoadingJobApplication">                
                <div class="my-8">
                    <div class="bg-gray-200 py-3 px-4">
                        <p>Details</p>
                    </div>
                    <div>
                        <dl class="py-2 px-4 space-y-3">
                            <div class="flex space-x-4 py-2 border-b">
                                <dt class="w-1/4 sm:w-40">Talent Name</dt>
                                <dd class="text-gray-500 w-3/4 sm:w-auto">
                                    {{ `${selectedApplication?.first_name || 'N/A'} ${selectedApplication?.last_name || 'N/A'}` }}
                                </dd>
                            </div>
                            <div class="flex space-x-4 py-2 border-b">
                                <dt class="w-1/4 sm:w-40">Email</dt>
                                <dd class="text-gray-500 w-3/4 sm:w-auto">{{  selectedApplication?.email || 'N/A' }}</dd>
                            </div>
                            <div class="flex space-x-4 py-2 border-b">
                                <dt class="w-1/4 sm:w-40">Phone</dt>
                                <dd class="text-gray-500 w-3/4 sm:w-auto">{{  selectedApplication?.phone || 'N/A' }}</dd>
                            </div>
                            <div class="flex space-x-4 py-2 border-b">
                                <dt class="w-1/4 sm:w-40">Portfolio</dt>
                                <dd class="text-gray-500 w-3/4 sm:w-auto">{{ selectedApplication?.portfolio || 'N/A' }}</dd>
                            </div>
                            <div class="flex space-x-4 py-2 border-b">
                                <dt class="w-1/4 sm:w-40">Cover Letter</dt>
                                <dd class="text-gray-500 w-3/4 sm:w-auto">{{ selectedApplication?.cover_letter || 'N/A' }}</dd>
                            </div>
                            <div class="flex space-x-4 py-2 border-b">
                                <dt class="w-1/4 sm:w-40">Resume</dt>
                                <dd class="text-gray-500 w-3/4 sm:w-auto">
                                    <a class="inline-flex items-center space-x-2" :href="selectedApplication.resume" target="_blank" v-if="selectedApplication.resume">
                                        <VueFeather type="file" class="w-4" />
                                        <span>View</span>
                                    </a>
                                    <span v-else>N/A</span>
                                </dd>
                            </div>
                            <div class="flex space-x-4 py-2 border-b">
                                <dt class="w-1/4 sm:w-40">Created Date</dt>
                                <dd class="text-gray-500 w-3/4 sm:w-auto">{{ datetimeFormat(job?.created_at) || 'N/A' }}</dd>
                            </div>
                            <div class="flex space-x-4 py-2 border-b">
                                <dt class="w-1/4 sm:w-40">Status</dt>
                                <div>
                                    <div v-if="!toggleStatusForm" class="flex items-center space-x-2 pb-2">
                                        <dd class="text-gray-500 w-3/4 sm:w-auto">{{ selectedApplication?.status || 'N/A' }}</dd>
                                        <button 
                                            @click="toggleStatusForm = !toggleStatusForm" 
                                            class="w-6 h-6 bg-blue-600 text-white rounded p-0.5"
                                        >
                                            <VueFeather type="edit-2" class="w-4" />
                                        </button>
                                    </div>

                                    <div v-else class="flex flex-wrap items-center space-y-2 md:space-y-0 md:space-x-2">
                                        <select v-model="status" class="border rounded-md py-2 px-2 text-sm">
                                            <option
                                                v-for="(option, key) in statuses" 
                                                :key="key" :value="option"
                                            >
                                                {{ option }}
                                            </option>
                                        </select>
                                        <div class="space-x-2">
                                            <button 
                                                @click="editStatus(option)" 
                                                class="w-6 h-6 bg-green-600 text-white rounded p-1"
                                            >
                                                <VueFeather type="check" class="w-4" />
                                            </button>
                                            <button 
                                                @click="toggleStatusForm = !toggleStatusForm" 
                                                class="w-6 h-6 bg-red-600 text-white rounded p-1">
                                                <VueFeather type="x" class="w-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </dl>
                    </div>
                </div>

                <!-- <pdf src="https://cdn.mozilla.net/pdfjs/tracemonkey.pdf" /> -->
            </div>
            <div v-else>
                <Loader />
            </div>
        </main>      
        
        <NotificationBar 
            :active="showAlert"
            @close="showAlert = $event"
        />
    </Layout>
</template>
  
<script setup>
import Layout from '../../layout/index.vue'
// import pdf from 'vue-pdf'
import { onBeforeMount, onMounted, ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import Loader from '../../components/Loader.vue';
import NotificationBar from '../../components/NotificationBar.vue';
import { isEmpty, o_O } from '../../helpers'
import { useFirebaseDB } from '../../composables/useFirebaseDB'
import VueFeather from 'vue-feather'

const toggleStatusForm = ref(false)
const showAlert = ref(false)
const isLoading = ref(true)
const isLoadingJobApplication = ref(true)
const job  = ref({})
const selectedApplication  = ref([])
const status = ref(selectedApplication.value?.status || '')

const route = useRoute()
const {id, application} = route.params

let statuses = ref([ 'Pending', 'Reviewing', 'Cancelled', 'Declined', 'Accepted'])

const { convertTimestamp, deleteData, getDataWithId, updateData } = useFirebaseDB()

const editStatus = async() => {
    if(selectedApplication.value.status !== status.value) {
        let form = {status: status.value}
        let [error, data] = await o_O(updateData('job_applications', form, application))
        if(error) return console.log(error, data)
        getJobApplication()

        // alert('Successfully Updated')
        showAlert.value = true
        toggleStatusForm.value = false
    }
}

function datetimeFormat(timestamp) {
    if(!isEmpty(timestamp)) {
        return convertTimestamp(timestamp)
    }
	return 'Date not specified'
}

const getJob = async () => {
    let [error, data] = await o_O(getDataWithId('jobs', id));
    if(error) return console.log(error)
    job.value = data
    isLoading.value = false
}

const getJobApplication = async () => {
    if(job.value && job.value.id) {
        let [error, data] = await o_O(getDataWithId('job_applications', application));
        if(error) return console.log(error)
        selectedApplication.value = data
        isLoadingJobApplication.value = false
        // console.log(data)
    }
}

const handleAlert = ($event) => {
    showAlert.value = $event; 
    getJob()
}

onBeforeMount(() => {
    getJob()
})

onMounted(() => {
    setTimeout(() => {
        getJobApplication()
    }, 3000)
})
</script>