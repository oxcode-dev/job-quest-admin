<!-- eslint-disable vue/multi-word-component-names -->
<template>
    <Layout>
        <main class="rounded-lg bg-white text-slate-500 px-4 py-4">
            <div class="flex items-center justify-between px-2">
                <h2 class="text-2xl font-semibold text-slate-800">Talent</h2>
                <div class="inline-flex space-x-2">
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
                                <div class="inline-flex items-center space-x-2">
                                    <img class="w-8 h-8 rounded-full object-cover" :src="talent.avatar || 'https://img.freepik.com/premium-vector/young-smiling-man-avatar-man-with-brown-beard-mustache-hair-wearing-yellow-sweater-sweatshirt-3d-vector-people-character-illustration-cartoon-minimal-style_365941-860.jpg'" />
                                    <dd class="text-gray-500 w-3/4 sm:w-auto">{{ `${talent?.first_name || 'N/A'} ${talent?.last_name || 'N/A'}` }}</dd>
                                </div>
                            </div>
                            <div class="flex space-x-4 py-2 border-b">
                                <dt class="w-1/4 sm:w-40">Email</dt>
                                <dd class="text-gray-500 w-3/4 sm:w-auto">{{ talent?.email || 'N/A' }}</dd>
                            </div>
                            <div class="flex space-x-4 py-2 border-b">
                                <dt class="w-1/4 sm:w-40">Phone</dt>
                                <dd class="text-gray-500 w-3/4 sm:w-auto">{{ talent?.phone || 'N/A' }}</dd>
                            </div>
                            <div class="flex space-x-4 py-2 border-b">
                                <dt class="w-1/4 sm:w-40">Portfolio</dt>
                                <dd class="text-gray-500 w-3/4 sm:w-auto">{{ talent?.portfolio || 'N/A' }}</dd>
                            </div>
                        
                            <div class="flex space-x-4 py-2 border-b">
                                <dt class="w-1/4 sm:w-40">Location</dt>
                                <dd class="text-gray-500 w-3/4 sm:w-auto">{{ talent?.location || 'N/A' }}</dd>
                            </div>
                            <div class="flex space-x-4 py-2 border-b">
                                <dt class="w-1/4 sm:w-40">Created Date</dt>
                                <dd class="text-gray-500 w-3/4 sm:w-auto">{{ datetimeFormat(talent?.created_at) || 'N/A' }}</dd>
                            </div>
                        </dl>
                    </div>
                </div>
                <div class="my-8">
                    <div class="bg-gray-200 py-3 px-4">
                        <p>Jobs</p>
                    </div>
                    <div class="flex my-3 space-x-3">
                        <a 
                            v-for="index in tabs" :key="index" 
                            @click.prevent="selectedTab = index" href="#"
                            :class="`p-2 rounded-lg capitalize hover:bg-blue-600 hover:text-white ${selectedTab === index ? 'bg-blue-600 text-white': 'bg-gray-100 text-gray-700'}`"
                        >
                            {{ index }}
                        </a>
                    </div>
                    <div class="w-full sm:inline-block rounded-lg overflow-hidden">
                        <JobsTable 
                            :jobs="jobs"
                        />
                    </div>
                </div>
            </div>
            <div v-if="isLoading">
                <Loader />
            </div>
        </main>      
    
    </Layout>
</template>
  
<script setup>
import Layout from '../../layout/index.vue'
import { computed, onBeforeMount, ref } from 'vue'
import { useRoute } from 'vue-router'
import JobsTable from '../../components/tables/JobsTable.vue';
import Loader from '../../components/Loader.vue';
import { isEmpty, o_O } from '../../helpers'
import { useFirebaseDB } from '../../composables/useFirebaseDB'
import { useIndustriesStore } from '../../stores/industries'

const isLoading = ref(true)
const talent = ref({})
const saved_jobs  = ref([])
const applied_jobs  = ref([])
const industriesStore = useIndustriesStore()
const tabs = ref(['applied', 'saved'])
const selectedTab = ref('applied')
const jobs = computed(() => {
    if(selectedTab.value === 'applied') return applied_jobs.value
    if(selectedTab.value === 'saved') return saved_jobs.value

    return []
})

const route = useRoute()
const {id} = route.params

const { getDataWhereKeyValue, convertTimestamp, getDataWithId, getDataWhereKeyInValues } = useFirebaseDB()

function datetimeFormat(timestamp) {
    if(!isEmpty(timestamp)) {
        return convertTimestamp(timestamp)
    }
	return 'Date not specified'
}

const getTalent = async () => {
    let [error, data] = await o_O(getDataWithId('talents', id));
    if(error) return console.log(error)
    talent.value = data
    isLoading.value = false
}

const getSavedJobs = async () => {
    let [error, data] = await o_O(getDataWhereKeyValue('saved_jobs', 'user_id', id))
    if(error) return console.log(error)
    let jobIds = data.map(n => n.job_id)
    if(jobIds.length > 0){
        let [err, jobs] = await o_O(getAllJobs(jobIds))
        if(err) return console.error(err)
        saved_jobs.value = jobs
    }
}

const getAppliedJobs = async () => {
    let [error, data] = await o_O(getDataWhereKeyValue('job_applications', 'user_id', id))
    if(error) return console.log(error)
    let jobIds = data.map(n => n.job_id)
    if(jobIds.length > 0){
        let [err, jobs] = await o_O(getAllJobs(jobIds))
        if(err) return console.error(err)
        applied_jobs.value = jobs
    }
}

const getAllJobs = async(jobs) => {
    let [error, data] = await o_O(getDataWhereKeyInValues('jobs', 'id', jobs))
    if(error) {
        return error.value = error
    }
    return data
}

onBeforeMount(() => {
    industriesStore.fetchIndustries()
    getTalent()
    getAppliedJobs()
    getSavedJobs()
})
</script>