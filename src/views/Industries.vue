<!-- eslint-disable vue/multi-word-component-names -->
<template>
    <Layout>
        <main class="rounded-lg bg-white text-slate-500 px-4 py-4">
            <div class="flex items-center justify-between px-2">
                <h2 class="text-2xl font-semibold text-slate-800">Industries</h2>
                <button @click="handleSelectIndustry({})" class="px-4 bg-blue-700 text-white py-1.5 rounded">Add</button>
            </div>
            <IndustriesTable
                :industries="industries"
                :editIndustry="handleSelectIndustry"
                :deleteIndustry="handleDeleteIndustry"
            />
        </main>

        <IndustryForm 
            :show="showForm" 
            :industry="selectedIndustry"
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
            :submit-fn="deleteIndustry"
            @close="showDialog = $event"
        />
    </Layout>
</template>
  
<script setup>
import Layout from '../layout/index.vue'
import { onBeforeMount, computed, ref} from 'vue'
import { useIndustriesStore } from '../stores/industries'
import IndustriesTable from '../components/tables/IndustriesTable.vue'
import IndustryForm from '../forms/IndustryForm.vue'
import NotificationBar from '../components/NotificationBar.vue';
import ConfirmPromptBar from '../components/ConfirmPromptBar.vue';
import { useFirebaseDB } from '../composables/useFirebaseDB'
import { o_O } from '../helpers'

const industriesStore = useIndustriesStore()
const { deleteData } = useFirebaseDB()

const industries = computed(() => industriesStore.getIndustries || [])
const showForm = ref(false)
const showAlert = ref(false)
const showDialog = ref(false)
const selectedIndustry = ref({})

function handleSelectIndustry (industry={}) {
    selectedIndustry.value = industry
    showForm.value = true
}

async function handleDeleteIndustry(option) {
    selectedIndustry.value = option
    showDialog.value = true
}

async function deleteIndustry () {
    let [error, data] = await o_O(deleteData('industries', selectedIndustry.value.id))
    if(error) return console.log(error)

    industriesStore.fetchIndustries()
    showDialog.value = false
    showAlert.value = true
    selectedIndustry.value = {}
    console.log(data)
}

onBeforeMount(() => {
    industriesStore.fetchIndustries()
})
  
</script>