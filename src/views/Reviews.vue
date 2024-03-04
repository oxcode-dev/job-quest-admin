<!-- eslint-disable vue/multi-word-component-names -->
<template>
    <Layout>
        <main class="rounded-lg bg-white text-slate-500 px-4 py-4">
            <div class="flex items-center justify-between px-2">
                <h2 class="text-2xl font-semibold text-slate-800">Reviews</h2>
                <button @click="handleSelectReview({})" class="px-4 bg-blue-700 text-white py-1.5 rounded">Add</button>
            </div>

            <pre>{{ allData }}</pre>
            

            <div class="flex justify-between items-center py-3 px-2">
                <div>
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

        <!-- <ReviewForm 
            :show="showForm" 
            :review="selectedReview"
            @close="showForm = $event"
            @alert="showAlert = $event"
            v-if="showForm"
        /> -->

        <NotificationBar 
            :active="showAlert"
            @close="showAlert = $event"
        />
        <ConfirmPromptBar 
            :active="showDialog"
            :submit-fn="deleteReview"
            @close="showDialog = $event"
        />
    </Layout>
</template>
  
<script setup>
import Layout from '../layout/index.vue'
import { onBeforeMount, ref} from 'vue'
import { useReviewsStore } from '../stores/reviews'
// import ReviewForm from '../forms/ReviewForm.vue';
// import ReviewsTable from '../components/tables/ReviewsTable.vue';
import NotificationBar from '../components/NotificationBar.vue';
import ConfirmPromptBar from '../components/ConfirmPromptBar.vue';
import { usePaginationDB } from '../composables/usePaginationDB'

const reviewsStore = useReviewsStore()

const showForm = ref(false)
const showAlert = ref(false)
const showDialog = ref(false)
const selectedReview = ref({})

const { pageTitle, pages, currentPage, handleNextPage, handlePrevPage, allData } = usePaginationDB('recruiters')

function handleSelectReview (review={}) {
    selectedReview.value = review
    showForm.value = true
}

// async function handleDeleteReview(option) {
//     selectedReview.value = option
//     showDialog.value = true
// }

async function deleteReview () {
    await reviewsStore.deleteReview(selectedReview.value.id)
    showDialog.value = false
    showAlert.value = true
    selectedReview.value = {}
    // getReviews()
}



onBeforeMount(() => {
    // getReviews()
    // countAllReviews()
})
  
</script>