<!-- eslint-disable vue/multi-word-component-names -->
<template>
    <Layout>
        <main class="rounded-lg bg-white text-slate-500 px-4 py-4">
            <div class="flex items-center justify-between px-2">
                <h2 class="text-2xl font-semibold text-slate-800">Jobs</h2>
                <button @click="handleSelectProduct({})" class="px-4 bg-blue-700 text-white py-1.5 rounded">Add</button>
            </div>

            <Loader v-if="isLoading" />
            <JobsTable
                v-if="!isLoading"
                :jobs="jobs"
            />
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
            <JobForm
                :show="showForm"
                :job="selectedProduct"
                v-if="showForm"
                @close="showForm = $event"
                @alert="showAlert = $event"
            />

            <NotificationBar 
                :active="showAlert"
                @close="showAlert = $event"
            />
            <ConfirmPromptBar 
                :active="showDialog"
                :submit-fn="deleteProduct"
                @close="showDialog = $event"
            />
        </div>
    </Layout>
</template>

<script setup>
import Layout from '../../layout/index.vue'
import { onBeforeMount, ref } from 'vue'
//*321*00# *321*02*080# 09059672002 08076009888
import JobsTable from '../../components/tables/JobsTable.vue';
import NotificationBar from '../../components/NotificationBar.vue';
import ConfirmPromptBar from '../../components/ConfirmPromptBar.vue';
import Loader from '../../components/Loader.vue';
import JobForm from '../../forms/JobForm.vue'
import { usePaginationDB } from '../../composables/usePaginationDB'
import { useIndustriesStore } from '../../stores/industries'
import { useCategoriesStore } from '../../stores/categories'

const { 
    pageTitle, pages, currentPage, handleNextPage, handlePrevPage, allData: jobs, isLoading, getData
} = usePaginationDB('jobs')

const showForm = ref(false)
const showAlert = ref(false)
const showDialog = ref(false)
const selectedProduct = ref({})

const industriesStore = useIndustriesStore()
const categoriesStore = useCategoriesStore()

function handleSelectProduct (option={}) {
    selectedProduct.value = option
    showForm.value = true
}

onBeforeMount(() => {
    industriesStore.fetchIndustries()
    categoriesStore.fetchCategories()    
})
</script>