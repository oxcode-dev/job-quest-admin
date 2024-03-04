<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <Layout>
    <main>
      <div class="rounded-lg bg-white text-slate-500 px-4 py-4">
        <div>
          <h2 class="text-xl font-semibold text-slate-800">Dashboard</h2>
        </div>
      </div>

      <div class="my-8">
        <div class="flex flex-wrap w-full">
          <div class="w-full sm:w-1/3 lg:w-1/3" v-for="(option, key) in tabs" :key="key">
            <div class="bg-white m-2 h-32 rounded-md p-4 text-slate-500">
              <div class="flex flex-col space-y-2 items-center justify-center">
                <VueFeather :type="option.icon" v-if="option.icon" />
                <p class="text-sm">{{ option?.title || 'N/A' }}</p>
                <h2 class="text-2xl font-semibold text-slate-800">{{ option?.count || 0 }}</h2>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="my-8">
        <div class="rounded-lg bg-white text-slate-500 px-4 py-4">
          <div class="flex justify-between">
            <h2 class="text-slate-800">Job Applications</h2>
            <!-- <router-link to="/orders">
              <span class="text-sm hover:underline">View All</span>
            </router-link> -->
          </div>
          <ApplicationsTable :applications="applications" :jobs="jobs" />
        </div>
      </div>
    </main>
  </Layout>
</template>

<script setup>
import Layout from '../layout/index.vue'
import { onBeforeMount, computed, ref } from 'vue'
import { useFirebaseDB } from '../composables/useFirebaseDB'
import { o_O } from '../helpers'
import VueFeather from 'vue-feather'
import ApplicationsTable from '../components/tables/ApplicationsTable.vue'

const applications = ref([])
const jobs = ref([])
// const selectedApplications = computed(() => applications.value.slice(0,10))

const tabs = ref([
  {
    title: 'Talents',
    count: 0,
    icon: 'users'
  },  
  {
    title: 'Job Applications',
    count: 0,
    icon: 'file-text'
  },
  {
    title: 'Jobs',
    count: 0,
    icon: 'briefcase'
  },
])

const { getTotalData, getAllData, getDataWhereKeyInValues } = useFirebaseDB()

const getTotalTalents = async() => {
  let [error, data] = await o_O(getTotalData('talents'))
  if(error) return console.log(error)

  tabs.value.find(n => n.title === 'Talents').count = data
}

const getTotalJobApplications = async() => {
  let [error, data] = await o_O(getTotalData('job_applications'))
  if(error) return console.log(error)

  tabs.value.find(n => n.title === 'Job Applications').count = data
}

const getTotalJobs = async() => {
  let [error, data] = await o_O(getTotalData('jobs'))
  if(error) return console.log(error)

  tabs.value.find(n => n.title === 'Jobs').count = data
}

const getAllJobApplications = async() => {
  let [error, data] = await o_O(getAllData('job_applications'))
  if(error) return console.log(error)

  const newData = data.slice(0,10)
  getApplicationJobs(newData)
  applications.value = newData
}

const getApplicationJobs = async(application) => {
  let jobIds = application.map(n => n.job_id)
  let [error, data] = await o_O(getDataWhereKeyInValues('jobs', 'id', jobIds))
  if(error) {
      console.log(error)
  }
  jobs.value = data
}

onBeforeMount(() => {
  getTotalTalents()
  getTotalJobApplications()
  getTotalJobs()
  getAllJobApplications()
})

</script>