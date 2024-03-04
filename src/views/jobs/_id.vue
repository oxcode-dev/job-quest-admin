<!-- eslint-disable vue/multi-word-component-names -->
<template>
    <Layout>
        <main class="rounded-lg bg-white text-slate-500 px-4 py-4">
            <div class="flex items-center justify-between px-2">
                <h2 class="text-2xl font-semibold text-slate-800">Jobs</h2>
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
                                <dt class="w-1/4 sm:w-40">Title</dt>
                                <dd class="text-gray-500 w-3/4 sm:w-auto">{{ job?.title || 'N/A' }}</dd>
                            </div>
                            <div class="flex space-x-4 py-2 border-b">
                                <dt class="w-1/4 sm:w-40">Category</dt>
                                <dd class="text-gray-500 w-3/4 sm:w-auto">{{  category?.name || 'N/A' }}</dd>
                            </div>
                            <div class="flex space-x-4 py-2 border-b">
                                <dt class="w-1/4 sm:w-40">Industry</dt>
                                <dd class="text-gray-500 w-3/4 sm:w-auto">{{  industry?.name || 'N/A' }}</dd>
                            </div>
                            <div class="flex space-x-4 py-2 border-b">
                                <dt class="w-1/4 sm:w-40">Type</dt>
                                <dd class="text-gray-500 w-3/4 sm:w-auto">{{ job?.job_type || 'N/A' }}</dd>
                            </div>
                            <div class="flex space-x-4 py-2 border-b">
                                <dt class="w-1/4 sm:w-40">Location</dt>
                                <dd class="text-gray-500 w-3/4 sm:w-auto">{{ job?.location || 'N/A' }}</dd>
                            </div>
                            <div class="flex space-x-4 py-2 border-b">
                                <dt class="w-1/4 sm:w-40">Position Available</dt>
                                <dd class="text-gray-500 w-3/4 sm:w-auto">{{ job?.position_available || 1 }}</dd>
                            </div>
                            <div class="flex space-x-4 py-2 border-b">
                                <dt class="w-1/4 sm:w-40">Salary</dt>
                                <dd class="text-gray-500 w-3/4 sm:w-auto">
                                    <div>
                                        <span>{{ job?.min_salary || 'N/A' }}</span> - 
                                        <span>{{ job?.max_salary || 'N/A' }}</span> 
                                        <span> NGN/yr</span>
                                    </div>
                                </dd>
                            </div>
                            <div class="flex space-x-4 py-2 border-b">
                                <dt class="w-1/4 sm:w-40">Recruiter</dt>
                                <dd class="text-gray-500 w-3/4 sm:w-auto">{{ recruiter?.name || 'N/A' }}</dd>
                            </div>
                            <div class="flex space-x-4 py-2 border-b">
                                <dt class="w-1/4 sm:w-40">Description</dt>
                                <dd class="text-gray-500 w-3/4 sm:w-auto">{{ job.description }}</dd>
                            </div>
                            <div class="flex space-x-4 py-2 border-b">
                                <dt class="w-1/4 sm:w-40">Qualification</dt>
                                <dd class="text-gray-500 w-3/4 sm:w-auto">{{ job.qualification }}</dd>
                            </div>
                            <div class="flex space-x-4 py-2 border-b">
                                <dt class="w-1/4 sm:w-40">Created Date</dt>
                                <dd class="text-gray-500 w-3/4 sm:w-auto">{{ datetimeFormat(job?.created_at) || 'N/A' }}</dd>
                            </div>
                        </dl>
                    </div>
                </div>
                <div class="my-8" v-if="applications.length > 0">
                    <div class="bg-gray-200 py-3 px-4">
                        <p>Job Applications</p>
                    </div>
                    <div class="w-full inline-block rounded-lg overflow-y-scroll">
                        <table class="leading-normal w-full">
                            <thead>
                                <tr>
                                    <th class="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">User</th>
                                    <th class="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        <h2>Job</h2>
                                    </th>
                                    <th class="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        <h2>Status</h2>
                                    </th>
                                    <th class="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        <h2>Date</h2>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(item, key) in applications" :key="key">
                                    <td class="px-5 py-4 border-b border-gray-200 bg-white text-sm">
                                        <router-link :to="`/jobs/${id}/application/${item.id}`" class="flex flex-col">
                                            <p class="text-sm font-medium">{{ `${item?.last_name || 'N/A'} ${item?.last_name || 'N/A'}` }}</p>
                                            <p class="text-xs font-light">{{ item.email || 'N/A' }}</p>
                                        </router-link>
                                    </td>
                                    <td class="px-5 py-4 border-b border-gray-200 bg-white text-sm text-gray-500 text-left">
                                        <router-link :to="`/jobs/${id}/application/${item.id}`" class="whitespace-no-wrap">
                                            {{ job?.title || 'N/A' }}
                                        </router-link>
                                    </td>
                                    <td class="px-5 py-4 border-b border-gray-200 bg-white text-left text-sm text-gray-500">
                                        <router-link :to="`/jobs/${id}/application/${item.id}`" class="text-sm capitalize">
                                            {{ item?.status || 'pending' }}
                                        </router-link>
                                    </td>
                                    <td class="px-5 py-4 border-b border-gray-200 bg-white text-sm text-left">
                                        <router-link :to="`/jobs/${id}/application/${item.id}`" class="text-gray-500 whitespace-no-wrap">
                                            {{ item.created_at ? datetimeFormat(item.created_at) : 'N/A' }}
                                        </router-link>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
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
            :submit-fn="deleteJob"
            @close="showDialog = $event"
        />
        <div>
            <JobForm
                :job="job"
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
import { onBeforeMount, onMounted, ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import Loader from '../../components/Loader.vue';
import NotificationBar from '../../components/NotificationBar.vue';
import ConfirmPromptBar from '../../components/ConfirmPromptBar.vue';
import { isEmpty, o_O } from '../../helpers'
import { useFirebaseDB } from '../../composables/useFirebaseDB'
import router from '../../router'
import JobForm from '../../forms/JobForm.vue'
import { useIndustriesStore } from '../../stores/industries'
import { useCategoriesStore } from '../../stores/categories'

const showAlert = ref(false)
const showDialog = ref(false)
const isLoading = ref(true)
const isLoadingJobApplication = ref(true)
const showForm = ref(false)
const job  = ref({})
const applications  = ref([])
const industriesStore = useIndustriesStore()
const categoriesStore = useCategoriesStore()

const route = useRoute()
const {id} = route.params
const recruiter = ref({})
const industry = computed(() => {
    let industries = industriesStore.getIndustries
    return job.value?.recruiter_id 
        ? industries.find(n => n.id === recruiter.value.industry_id) 
        : {}
})

const category = computed(() => {
    let industries = categoriesStore.getCategories
    return job.value?.category_id 
        ? industries.find(n => n.id === job.value.category_id) 
        : {}
})

const { getDataWhereKeyValue, convertTimestamp, deleteData, getDataWithId } = useFirebaseDB()

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

const getJobRecruiter = async () => {
    if(job.value && job.value.recruiter_id) {
        let [error, data] = await o_O(getDataWithId('recruiters', job.value?.recruiter_id));
        if(error) return console.log(error)
        recruiter.value = data
        // console.log(data)
    }
}

const getJobApplications = async () => {
    if(job.value && job.value.id) {
        let [error, data] = await o_O(getDataWhereKeyValue('job_applications', 'job_id', job.value?.id));
        if(error) return console.log(error)
        applications.value = data
        isLoadingJobApplication.value = false
        // console.log(data)
    }
}

const handleAlert = ($event) => {
    showAlert.value = $event; 
    getJob()
}

const deleteJob = async () => {
    try {
        await deleteData('jobs', id)
        showDialog.value = false
        showAlert.value = true
        setTimeout(() => router.push('/jobs'), 300)
    }
    catch (error) {
        console.log(error)
    }
    // orderItems.value.map((item) => {
    //     deleteData('order_items', item.id)
    // })
}

onBeforeMount(() => {
    getJob()
    industriesStore.fetchIndustries()
    categoriesStore.fetchCategories()
})

onMounted(() => {
    setTimeout(() => {
        getJobRecruiter()
        getJobApplications()
    }, 7000)
})
</script>