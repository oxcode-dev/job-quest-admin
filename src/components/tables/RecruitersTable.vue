<!-- eslint-disable vue/valid-template-root -->
<template>
    <div class="flex flex-col">
        <div class="overflow-x-auto sm:mx-0.5 lg:mx-0.5">
            <div class="py-2 inline-block min-w-full">
                <div v-if="recruiters && recruiters.length > 0" class="overflow-hidden">
                    <table class="min-w-full">
                        <thead class="bg-white border-b">
                            <tr>
                                <th scope="col" class="text-sm font-medium text-gray-900 px-6 py-4 text-left">
                                    Name
                                </th>
                                <th scope="col" class="text-sm font-medium text-gray-900 px-6 py-4 text-left">
                                    Industry
                                </th>
                                <th scope="col" class="text-sm font-medium text-gray-900 px-6 py-4 text-left">
                                    Location
                                </th>
                                <th scope="col" class="text-sm font-medium text-gray-900 px-6 py-4 text-left">
                                    Date
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr class="bg-gray-100 border-b" v-for="(option, key) in recruiters" :key="key">
                                <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap block">
                                    <router-link class="w-full h-full" :to="`/recruiters/${option.id}`">
                                        {{ option?.name || 'N/A' }}
                                    </router-link>
                                </td>
                                <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                                    <router-link :to="`/recruiters/${option.id}`" class="h-full w-full">
                                        <span v-if="!option?.industry_id">N/A</span>
                                        <span v-if="option?.industry_id">
                                            {{ industries.find(n => n.id === option?.industry_id).name}}
                                        </span>
                                    </router-link>
                                </td>
                                <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                                    <router-link :to="`/recruiters/${option.id}`"  class="w-full h-full">
                                        {{ option?.location || 'N/A' }}
                                    </router-link>
                                </td>
                                <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                                    <router-link :to="`/recruiters/${option.id}`" class="w-full h-full">
                                        <span>{{ convertTimestamp(option.created_at) }}</span>
                                    </router-link>
                                </td>
                            </tr>
                            
                        </tbody>
                    </table>
                </div>
                <EmptyState v-if="recruiters && recruiters.length === 0" />
            </div>
        </div>
    </div>
</template>

<script setup>
import { useFirebaseDB } from '../../composables/useFirebaseDB'
import EmptyState from '../EmptyState.vue'
import { useIndustriesStore } from '../../stores/industries'
import { computed } from 'vue'

const { convertTimestamp } = useFirebaseDB()
const industriesStore = useIndustriesStore()
const industries = computed(() => industriesStore.getIndustries || [])

defineProps({
    recruiters: Array,
})
</script>
