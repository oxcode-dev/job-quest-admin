<!-- eslint-disable vue/multi-word-component-names -->
<template>
    <Layout>
        <main class="rounded-lg bg-white text-slate-500 px-4 py-4">
            <div class="flex items-center justify-between px-2">
                <h2 class="text-2xl font-semibold text-slate-800">Categories</h2>
                <button @click="handleSelectCategory({})" class="px-4 bg-blue-700 text-white py-1.5 rounded">Add</button>
            </div>
            <CategoriesTable
                :categories="categories"
                :editCategory="handleSelectCategory"
                :deleteCategory="handleDeleteCategory"
            />
        </main>

        <CategoryForm 
            :show="showForm" 
            :category="selectedCategory"
            @close="showForm = $event"
            v-if="showForm"
            @alert="showAlert = $event"
        />

        <NotificationBar 
            :active="showAlert"
            @close="showAlert = $event"
        />
        <ConfirmPromptBar 
            :active="showDialog"
            :submit-fn="deleteCategory"
            @close="showDialog = $event"
        />
    </Layout>
</template>
  
<script setup>
import Layout from '../layout/index.vue'
import { onBeforeMount, computed, ref} from 'vue'
import { useCategoriesStore } from '../stores/categories'
import CategoriesTable from '../components/tables/CategoriesTable.vue'
import CategoryForm from '../forms/CategoryForm.vue'
import NotificationBar from '../components/NotificationBar.vue';
import ConfirmPromptBar from '../components/ConfirmPromptBar.vue';
import { useFirebaseDB } from '../composables/useFirebaseDB'
import { o_O } from '../helpers'

const categoriesStore = useCategoriesStore()
const { deleteData } = useFirebaseDB()

const categories = computed(() => categoriesStore.getCategories || [])
const showForm = ref(false)
const showAlert = ref(false)
const showDialog = ref(false)
const selectedCategory = ref({})

function handleSelectCategory (category={}) {
    selectedCategory.value = category
    showForm.value = true
}

async function handleDeleteCategory(option) {
    selectedCategory.value = option
    showDialog.value = true
}

async function deleteCategory () {
    let [error, data] = await o_O(deleteData('categories', selectedCategory.value.id))
    if(error) return console.log(error)

    categoriesStore.fetchCategories()
    showDialog.value = false
    showAlert.value = true
    selectedCategory.value = {}
    console.log(data)
}

onBeforeMount(() => {
    categoriesStore.fetchCategories()
})
  
</script>