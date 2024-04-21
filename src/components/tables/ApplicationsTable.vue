<!-- eslint-disable vue/valid-template-root -->
<template>
    <div class="flex flex-col">
        <div class="overflow-x-auto sm:mx-0.5 lg:mx-0.5">
            <div class="py-2 inline-block min-w-full">
                <div class="overflow-hidden" v-if="applications && applications.length > 0">
                    <table class="min-w-full">
                        <thead class="bg-white border-b">
                            <tr>
                                <th scope="col" class="text-sm font-medium text-gray-900 px-6 py-4 text-left">
                                    Talent
                                </th>
                                <th scope="col" class="text-sm font-medium text-gray-900 px-6 py-4 text-left">
                                    Job
                                </th>
                                <th scope="col" class="text-sm font-medium text-gray-900 px-6 py-4 text-left">
                                    Status
                                </th>
                                <th scope="col" class="text-sm font-medium text-gray-900 px-6 py-4 text-left">
                                    Date
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr class="bg-gray-100 border-b" v-for="(item, key) in applications" :key="key">
                                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    <router-link :to="`/jobs/${item.job_id}/application/${item.id}`" class="flex flex-col">
                                        <p class="text-sm font-medium">{{ `${item?.last_name || 'N/A'} ${item?.last_name || 'N/A'}` }}</p>
                                        <p class="text-xs font-light">{{ item.email || 'N/A' }}</p>
                                    </router-link>
                                </td>
                                <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                                    <router-link :to="`/jobs/${item.job_id}/application/${item.id}`" class="whitespace-no-wrap">
                                        <!-- {{ item.job_id ? (item.job_id) : 'N/A' }} -->
                                        {{ item.job_id ? jobTitle(item.job_id) : 'N/A' }}
                                    </router-link>
                                </td>
                                <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                                    <router-link :to="`/jobs/${item.job_id}/application/${item.id}`" class="text-sm capitalize">
                                        {{ item?.status || 'pending' }}
                                    </router-link>
                                </td>
                                <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                                    <router-link :to="`/jobs/${item.job_id}/application/${item.id}`" class="text-gray-500 whitespace-no-wrap">
                                        {{ item.created_at ? datetimeFormat(item.created_at) : 'N/A' }}
                                    </router-link>
                                </td>
                            </tr>
                            
                        </tbody>
                    </table>
                </div>

                <EmptyState v-if="applications && applications.length === 0" />
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { useFirebaseDB } from '../../composables/useFirebaseDB'
import {isEmpty} from '../../helpers/index'
import EmptyState from '../EmptyState.vue';

const props = defineProps({
    applications: Array,
    jobs: Array,
})

const { convertTimestamp } = useFirebaseDB()

function datetimeFormat(timestamp) {
    if(!isEmpty(timestamp)) {
        return convertTimestamp(timestamp)
    }
	return 'Date not specified'
}

const jobTitle = (job_id) => {
    return props.jobs.find(n => n.id === job_id)?.title || 'N/A'
}

</script>
