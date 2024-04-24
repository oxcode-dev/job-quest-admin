<!-- eslint-disable vue/valid-template-root -->
<template>
    <div class="flex flex-col">
        <div class="overflow-x-auto sm:mx-0.5 lg:mx-0.5">
            <div class="py-2 inline-block min-w-full">
                <div class="overflow-hidden" v-if="jobs && jobs.length > 0">
                    <table class="min-w-full">
                        <thead class="bg-white border-b">
                            <tr>
                                
                                <th scope="col" class="text-sm font-medium text-gray-900 px-6 py-4 text-left">
                                    Name
                                </th>
                                <th scope="col" class="text-sm font-medium text-gray-900 px-6 py-4 text-left">
                                    Category
                                </th>
                                <th scope="col" class="text-sm font-medium text-gray-900 px-6 py-4 text-left">
                                    Location
                                </th>
                                <th scope="col" class="text-sm font-medium text-gray-900 px-6 py-4 text-left">
                                    Industry
                                </th>
                                <th scope="col" class="text-sm font-medium text-gray-900 p-4 text-left">
                                    State
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr class="bg-gray-100 border-b" v-for="(option, key) in jobs" :key="key">
                                <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                                    <router-link class="w-full h-full" :to="`/jobs/${option.id}`">
                                        {{ option.title || 'N/A' }}
                                    </router-link>
                                </td>
                                <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                                    <router-link class="w-full h-full" :to="`/jobs/${option.id}`">
                                        {{ getCategoryName(option.category_id) }}
                                    </router-link>
                                </td>
                                <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                                    <router-link class="w-full h-full" :to="`/jobs/${option.id}`">
                                        {{ option.location || 'N/A' }}
                                    </router-link>
                                </td>
                                <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                                    <router-link class="w-full h-full" :to="`/jobs/${option.id}`">
                                        {{ getIndustryName(option.industry_id) }}
                                    </router-link>
                                </td>
                                <td class="p-4 whitespace-nowrap">
                                    <router-link class="w-full h-full" :to="`/jobs/${option.id}`">
                                        <span class="text-white rounded-full p-1.5 text-xs py-0.5" :class="option.isOpen ? 'bg-blue-600' : 'bg-red-500'">{{ option.isOpen ? 'Open' : 'Close' }}</span>
                                    </router-link>
                                </td>
                            </tr>
                            
                        </tbody>
                    </table>
                </div>

                <EmptyState v-else />
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue'
import { useCategoriesStore } from '../../stores/categories'
import { useIndustriesStore } from '../../stores/industries'
import EmptyState from '../EmptyState.vue'

defineProps({
    jobs: Array,
})

const categoriesStore = useCategoriesStore()
const categories = computed(() => categoriesStore.getCategories || [])

const getCategoryName = categoryId => {
    return categories.value.find(n => n.id === categoryId)?.name || 'N/A'
} 

const industriesStore = useIndustriesStore()
const industries = computed(() => industriesStore.getIndustries || [])

const getIndustryName = industryId => {
    return industries.value.find(n => n.id === industryId)?.name || 'N/A'
} 

</script>
