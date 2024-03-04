<!-- eslint-disable vue/multi-word-component-names -->
<template>
    <Layout>
        <main class="rounded-lg bg-white text-slate-500 px-4 py-4">
            <div class="flex items-center justify-between px-2">
                <h2 class="text-2xl font-semibold text-slate-800">Talents</h2>
            </div>

            <Loader v-if="isLoading" />
            <TalentsTable v-else :talents="allData" />
            
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
    </Layout>
</template>
  
<script setup>
import Layout from '../../layout/index.vue'
import TalentsTable from '../../components/tables/TalentsTable.vue'
import Loader from '../../components/Loader.vue'
import { usePaginationDB } from '../../composables/usePaginationDB'

const {
    pageTitle, pages, currentPage, handleNextPage, handlePrevPage, allData, isLoading, getData
} = usePaginationDB('talents', 'first_name')

</script>