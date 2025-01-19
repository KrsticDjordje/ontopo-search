<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import type { Restaurant } from '../types/api'

const props = defineProps<{
    restaurants: Restaurant[]
    hasMore: boolean
    loading: boolean
    isInitialLoad: boolean
    requestedTime?: string // Vreme koje je korisnik izabrao
}>()

const emit = defineEmits<{
    loadMore: []
}>()

const expandedRestaurantId = ref<string | null>(null)
const DEFAULT_IMAGE = 'https://res.cloudinary.com/ontopo/image/upload/q_auto:eco,c_crop,x_0,y_298,w_1200,h_444/w_750/v1717487816/assets/665ec830b86fc50014260eaa/665ec830b86fc50014260eaa/2.jpg'

function toggleTimeSlots(restaurantId: string) {
    expandedRestaurantId.value = expandedRestaurantId.value === restaurantId ? null : restaurantId
}

function formatTime(time: string) {
    return time.replace(/(\d{2})(\d{2})/, '$1:$2')
}

// Helper za ikone područja
const areaIcons: { [key: string]: string } = {
    'outside': '🌳',
    'inside': '🏠',
    'default': '🍽️'
}

// Helper za proveru da li ima više termina
function hasMoreTimeSlots(restaurant: Restaurant): boolean {
    return restaurant.availability?.areas?.some(area => area.options?.length > 1) || false
}

// Helper za proveru da li je termin blizu traženog vremena (±30 min)
function isRequestedTimeSlot(time: string): boolean {
    if (!props.requestedTime) return false
    const requested = parseInt(props.requestedTime)
    const current = parseInt(time)
    const diff = Math.abs(requested - current)
    return diff <= 30 // 30 minuta razlike
}

// Helper za sortiranje termina
function sortTimeSlots(area: any) {
    if (!area.options) return []
    return [...area.options].sort((a, b) => {
        const aIsRequested = isRequestedTimeSlot(a.time)
        const bIsRequested = isRequestedTimeSlot(b.time)
        if (aIsRequested && !bIsRequested) return -1
        if (!aIsRequested && bIsRequested) return 1
        return parseInt(a.time) - parseInt(b.time)
    })
}

// Helper za proveru da li je tačno traženo vreme
function isExactRequestedTime(time: string): boolean {
    return props.requestedTime === time
}

// Helper za proveru da li ima drugih termina osim traženog
function hasOtherTimeSlots(restaurant: Restaurant): boolean {
    return restaurant.availability?.areas?.some(area =>
        area.options?.some(opt => !isExactRequestedTime(opt.time))
    ) || false
}

// Infinite scroll logika
const observer = ref<IntersectionObserver | null>(null)
const loadTrigger = ref<HTMLDivElement | null>(null)

onMounted(() => {
    observer.value = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting && props.hasMore && !props.loading) {
            emit('loadMore')
        }
    }, {
        rootMargin: '100px'
    })

    if (loadTrigger.value) {
        observer.value.observe(loadTrigger.value)
    }
})

onUnmounted(() => {
    if (observer.value) {
        observer.value.disconnect()
    }
})
</script>

<template>
    <div class="restaurant-list space-y-8">
        <!-- Initial loading state -->
        <div v-if="isInitialLoad && loading" class="flex justify-center py-12">
            <svg class="animate-spin h-8 w-8 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none"
                viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                <path class="opacity-75" fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
        </div>

        <!-- Lista restorana -->
        <div v-else class="space-y-6">
            <div v-for="restaurant in restaurants" :key="restaurant.post.slug"
                class="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden">
                <div class="flex flex-col sm:flex-row">
                    <!-- Leva kolona - Slika -->
                    <div class="w-full sm:w-64 h-48 sm:h-auto flex-shrink-0">
                        <img :src="DEFAULT_IMAGE" :alt="restaurant.post.venue_name" class="w-full h-full object-cover">
                    </div>

                    <!-- Srednja kolona - Informacije -->
                    <div class="flex-1 p-6 border-r border-gray-100">
                        <h3 class="text-xl font-semibold mb-2">{{ restaurant.post.venue_name }}</h3>
                        <p class="text-gray-600 mb-1">{{ restaurant.availability.formattedRequest.service }}</p> <br>
                        <br>
                        <p class="text-gray-500 text-sm flex items-center gap-1">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            Beograd
                        </p>
                    </div>

                    <!-- Desna kolona - Termini -->
                    <div class="p-6 w-full sm:w-80 flex-shrink-0 bg-gray-100">
                        <!-- Glavni termini - izabrano vreme za prva tri područja -->
                        <div class="grid grid-cols-3 gap-2">
                            <template v-for="(area, index) in restaurant.availability?.areas || []" :key="area.id">
                                <div v-if="index < 3" class="flex flex-col gap-2">
                                    {{ console.log('Area:', area) }}
                                    {{ console.log('Options:', area.options) }}
                                    {{ console.log('Requested Time:', requestedTime) }}
                                    <button v-if="area.options?.some(opt => isExactRequestedTime(opt.time))"
                                        class="w-full px-4 py-2 bg-green-50 rounded-lg text-gray-700 hover:bg-green-100 transition-colors duration-200 border border-green-300">
                                        <span class="text-lg">{{ formatTime(requestedTime || '') }}</span>
                                        <span class="block text-sm text-gray-500 mt-1">{{ area.name }}</span>
                                    </button>
                                </div>
                            </template>
                        </div>

                        <!-- Show More dugme -->
                        <div v-if="hasOtherTimeSlots(restaurant) || restaurant.availability?.areas?.length > 2"
                            class="mt-4">
                            <button @click="toggleTimeSlots(restaurant.post.slug)"
                                class="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-700 transition-all duration-200 flex items-center justify-center gap-2 group">
                                <span>Ostali termini</span>
                                <svg class="w-4 h-4 transition-transform duration-200 text-gray-400 group-hover:text-gray-500"
                                    :class="{ 'rotate-180': expandedRestaurantId === restaurant.post.slug }" fill="none"
                                    stroke="currentColor" viewBox="0 0 24 24">
                                    <path d="M19 9l-7 7-7-7" stroke-width="2" stroke-linecap="round"
                                        stroke-linejoin="round" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Prošireni termini - sva područja sa svim terminima -->
                <div v-if="expandedRestaurantId === restaurant.post.slug"
                    class="border-t border-gray-100 p-6 bg-gray-50">
                    <div class="space-y-6">
                        <div v-for="area in restaurant.availability.areas" :key="area.id" class="space-y-3">
                            <!-- Naziv područja -->
                            <div class="flex items-center gap-2">
                                <span class="text-xl">{{ areaIcons[area.icon || 'default'] }}</span>
                                <h4 class="font-medium text-gray-800">{{ area.name }}</h4>
                            </div>
                            <!-- Svi termini za područje -->
                            <div class="grid grid-cols-4 gap-2">
                                <div v-for="option in area.options.filter(opt => !isExactRequestedTime(opt.time))
                                    .sort((a, b) => parseInt(a.time) - parseInt(b.time))" :key="option.time"
                                    class="flex flex-col">
                                    <button
                                        class="w-full px-2 py-2 bg-white text-gray-700 hover:bg-gray-100 transition-colors duration-200">
                                        {{ formatTime(option.time) }}
                                        <p class="text-sm text-gray-500 mt-1 hidden sm:block">Rezerviši sada</p>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Loading spinner za infinite scroll -->
            <div v-if="loading && !isInitialLoad" class="flex justify-center py-6">
                <div class="flex items-center gap-3">
                    <svg class="animate-spin h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none"
                        viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                        <path class="opacity-75" fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span class="text-sm text-gray-500">Učitavanje restorana...</span>
                </div>
            </div>
        </div>

        <!-- Infinite scroll -->
        <div ref="loadTrigger" class="h-px" />
    </div>
</template>

<style scoped>
.restaurant-list {
    margin-top: 1rem;
}

.restaurant-card {
    display: flex;
    gap: 1.5rem;
    background: white;
    border-radius: 8px;
    padding: 1rem;
    margin-bottom: 1rem;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.restaurant-image {
    width: 200px;
    height: 150px;
    border-radius: 4px;
    overflow: hidden;
}

.restaurant-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.restaurant-info {
    flex: 1;
}

.restaurant-info h3 {
    margin: 0;
    font-size: 1.2rem;
    font-weight: 500;
}

.address {
    margin: 0.5rem 0;
    color: #666;
    font-size: 0.9rem;
}

.location {
    color: #666;
    font-size: 0.9rem;
    margin-bottom: 1rem;
}

.time-slots {
    margin: 1rem 0;
}

.time-options {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 0.5rem;
}

.time-button {
    padding: 0.5rem 1rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    background: white;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    align-items: center;
    min-width: 80px;
}

.slot-type {
    font-size: 0.8rem;
    color: #666;
    margin-top: 0.25rem;
}

.show-more {
    background: none;
    border: none;
    color: #666;
    cursor: pointer;
    padding: 0;
    font-size: 0.9rem;
}

.load-more {
    text-align: center;
    margin-top: 2rem;
}

.load-more-button {
    background: none;
    border: 1px solid #ddd;
    padding: 0.75rem 2rem;
    border-radius: 4px;
    cursor: pointer;
    color: #666;
}

.no-results {
    text-align: center;
    padding: 2rem;
    color: #666;
}

span.block.text-sm.text-gray-500.mt-1 {
    overflow: hidden;
    text-overflow: ellipsis;
    line-height: 1.3;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
}
</style>