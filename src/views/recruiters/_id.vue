<!-- eslint-disable vue/multi-word-component-names -->
<template>
    <Layout>
        <main class="rounded-lg bg-white text-slate-500 px-4 py-4">
            <div class="flex items-center justify-between px-2">
                <h2 class="text-2xl font-semibold text-slate-800">Recruiter</h2>
                <div class="inline-flex space-x-2">
                    <button @click="() => showForm = true" class="px-4 bg-blue-700 text-white py-1.5 rounded">Edit</button>
                    <button @click="() => showDialog = true" class="px-4 bg-red-700 text-white py-1.5 rounded">Delete</button>
                </div>
            </div>

            <div v-if="!isLoading">                
                <div class="my-8">
                    <div class="bg-gray-200 py-3 px-4">
                        <p>Details</p>
                    </div>
                    <div>
                        <dl class="py-2 px-4 space-y-3">
                            <div class="flex space-x-4 py-2 border-b">
                                <dt class="w-1/4 sm:w-40">Name</dt>
                                <dd class="text-gray-500 w-3/4 sm:w-auto">{{ recruiter?.name || 'N/A' }}</dd>
                            </div>
                            <div class="flex space-x-4 py-2 border-b">
                                <dt class="w-1/4 sm:w-40">Email</dt>
                                <dd class="text-gray-500 w-3/4 sm:w-auto">{{ recruiter?.email || 'N/A' }}</dd>
                            </div>
                            <div class="flex space-x-4 py-2 border-b">
                                <dt class="w-1/4 sm:w-40">Phone</dt>
                                <dd class="text-gray-500 w-3/4 sm:w-auto">{{ recruiter?.phone || 'N/A' }}</dd>
                            </div>
                            <div class="flex space-x-4 py-2 border-b">
                                <dt class="w-1/4 sm:w-40">Industry</dt>
                                <dd class="text-gray-500 w-3/4 sm:w-auto">{{ recruiter?.industry_id || 'N/A' }}</dd>
                            </div>
                            
                            <div class="flex space-x-4 py-2 border-b">
                                <dt class="w-1/4 sm:w-40">Location</dt>
                                <dd class="text-gray-500 w-3/4 sm:w-auto">{{ recruiter?.bio || 'N/A' }}</dd>
                            </div>
                            <div class="flex space-x-4 py-2 border-b">
                                <dt class="w-1/4 sm:w-40">Bio</dt>
                                <dd class="text-gray-500 w-3/4 sm:w-auto">{{ recruiter?.location || 'N/A' }}</dd>
                            </div>
                            <div class="flex space-x-4 py-2 border-b">
                                <dt class="w-1/4 sm:w-40">Created Date</dt>
                                <dd class="text-gray-500 w-3/4 sm:w-auto">{{ datetimeFormat(recruiter?.created_at) || 'N/A' }}</dd>
                            </div>
                        </dl>
                    </div>
                </div>
                <div class="my-8">
                    <div class="bg-gray-200 py-3 px-4">
                        <p>Jobs</p>
                    </div>
                    <div class="w-full sm:inline-block rounded-lg overflow-hidden">
                        <JobsTable :jobs="jobs" />
                    </div>
                </div>
            </div>
            <div v-if="isLoading">
                <Loader />
            </div>
        </main>      
        
        <NotificationBar 
            :active="showAlert"
            @close="showAlert = $event"
        />
        <ConfirmPromptBar 
            :active="showDialog"
            :submit-fn="deleteRecruiter"
            @close="showDialog = $event"
        />
        <div>
            <RecruiterForm
                :recruiter="recruiter"
                :show="showForm"
                v-if="showForm"
                @close="showForm = $event"
                @alert="handleAlert($event)"
            />
        </div>
    </Layout>
</template>
  
<script setup>
import Layout from '../../layout/index.vue'
import { onBeforeMount, ref } from 'vue'
import { useRoute } from 'vue-router'
import JobsTable from '../../components/tables/JobsTable.vue';
import Loader from '../../components/Loader.vue';
import NotificationBar from '../../components/NotificationBar.vue';
import ConfirmPromptBar from '../../components/ConfirmPromptBar.vue';
import { isEmpty, o_O } from '../../helpers'
import { useFirebaseDB } from '../../composables/useFirebaseDB'
import router from '../../router'
import RecruiterForm from '../../forms/RecruiterForm.vue'
import { useIndustriesStore } from '../../stores/industries'

const showAlert = ref(false)
const showDialog = ref(false)
const isLoading = ref(true)
const showForm = ref(false)
const recruiter  = ref({})
const jobs  = ref([])
const industriesStore = useIndustriesStore()

const route = useRoute()
const {id} = route.params

const { getDataWhereKeyValue, convertTimestamp, deleteData, getDataWithId } = useFirebaseDB()

function datetimeFormat(timestamp) {
    if(!isEmpty(timestamp)) {
        return convertTimestamp(timestamp)
    }
	return 'Date not specified'
}

const getRecruiter = async () => {
    let [error, data] = await o_O(getDataWithId('recruiters', id));
    if(error) return console.log(error)
    recruiter.value = data
    isLoading.value = false
}

const getRecruiterJobs = async () => {
    let [error, data] = await o_O(getDataWhereKeyValue('jobs', 'recruiter_id', id))
    if(error) return console.log(error)
    jobs.value = data
}

const handleAlert = ($event) => {
    showAlert.value = $event; 
    getRecruiter()
}

const deleteRecruiter = async () => {
    try {
        await deleteData('recruiters', id)
        showDialog.value = false
        showAlert.value = true
        setTimeout(() => router.push('/recruiters'), 300)
    }
    catch (error) {
        console.log(error)
    }
    // orderItems.value.map((item) => {
    //     deleteData('order_items', item.id)
    // })
}

onBeforeMount(() => {
    industriesStore.fetchIndustries()
    getRecruiter()
    getRecruiterJobs()
})
</script>