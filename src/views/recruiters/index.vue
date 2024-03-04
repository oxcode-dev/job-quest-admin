<!-- eslint-disable vue/multi-word-component-names -->
<template>
    <Layout>
        <main class="rounded-lg bg-white text-slate-500 px-4 py-4">
            <div class="flex items-center justify-between px-2">
                <h2 class="text-2xl font-semibold text-slate-800">Recruiters</h2>
                <button @click="handleOpenForm()" class="px-4 bg-blue-700 text-white py-1.5 rounded">Add</button>
            </div>

            <Loader v-if="isLoading" />
            <RecruitersTable v-else :recruiters="allData" />
            
            <div class="flex justify-between items-center py-3 px-2" v-if="!isLoading">
                <div v-if="pages > 0">
                    <p v-html="pageTitle"></p>
                </div>
                <div class="flex space-x-4">
                    <button v-if="currentPage > 1" @click="handlePrevPage(currentPage - 1)" class="rounded-lg bg-gray-100 text-gray-600 px-2 py-1 w-20 border text-sm">
                        Prev
                    </button>
                    <button v-if="currentPage < pages" @click="handleNextPage(currentPage + 1)" class="rounded-lg bg-gray-100 text-gray-600 px-2 py-1 w-20 border text-sm">
                        Next
                    </button>
                </div>
            </div>
        </main>

        <div>
            <RecruiterForm
                :show="showForm"
                v-if="showForm"
                @close="showForm = $event"
                @alert="handleAlert($event)"
            />
            <NotificationBar 
                :active="showAlert"
                @close="showAlert = $event"
            />
        </div>
    </Layout>
</template>
  
<script setup>
import Layout from '../../layout/index.vue'
import { onMounted, ref } from 'vue'
import RecruiterForm from '../../forms/RecruiterForm.vue'
import RecruitersTable from '../../components/tables/RecruitersTable.vue'
import Loader from '../../components/Loader.vue'
import { usePaginationDB } from '../../composables/usePaginationDB'
import NotificationBar from '../../components/NotificationBar.vue';
import { useIndustriesStore } from '../../stores/industries'

const showForm = ref(false)
const showAlert = ref(false)
const selected = ref(false)
const industriesStore = useIndustriesStore()

const {
    pageTitle, pages, currentPage, handleNextPage, handlePrevPage, allData, isLoading, getData
} = usePaginationDB('recruiters')

const handleOpenForm = (recruiter={}) => {
    showForm.value = true
    selected.value = recruiter
}

const handleAlert = ($event) => {
    showAlert.value = $event; 
    getData()
}

onMounted(() => {
    industriesStore.fetchIndustries()
})

</script>