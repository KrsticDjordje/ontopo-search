<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useRestaurantStore } from '../stores/restaurant'
import RestaurantList from '../components/RestaurantList.vue'
import SearchForm from '../components/SearchForm.vue'
import { UserIcon, CalendarIcon, ClockIcon, ChevronLeftIcon } from '@heroicons/vue/24/outline'

const route = useRoute()
const router = useRouter()
const store = useRestaurantStore()

// Helper za parsiranje datuma iz URL-a
function parseQueryDate(dateStr?: string): string {
    if (!dateStr) return new Date().toISOString().split('T')[0]
    return dateStr.length === 8
        ? `${dateStr.slice(0, 4)}-${dateStr.slice(4, 6)}-${dateStr.slice(6, 8)}`
        : dateStr
}

// Varijable za form i prikaz
const selectedSize = ref(route.query.size?.toString() || '2')
const selectedDate = ref(parseQueryDate(route.query.date?.toString()))
const selectedTime = ref(route.query.time?.toString() || '2000')
const displayedSize = ref(selectedSize.value)
const displayedDate = ref(selectedDate.value)
const displayedTime = ref(selectedTime.value)

// Helper za formatiranje datuma za prikaz
function formatDate(date: string): string {
    try {
        const today = new Date().toISOString().split('T')[0]
        if (date === today) return 'Danas'

        // Konvertujemo string datum u Date objekat
        const [year, month, day] = date.split('-').map(Number)
        const dateObj = new Date(year, month - 1, day)

        return new Intl.DateTimeFormat('sr-RS', {
            day: 'numeric',
            month: 'long'
        }).format(dateObj)
    } catch (error) {
        console.error('Error formatting date:', error)
        return date
    }
}

function getTimeLabel(time: string): string {
    return `${time.slice(0, 2)}:${time.slice(2)}`
}

// Opcije za broj osoba
const partySizes = [
    { value: '1', label: '1 osoba' },
    { value: '2', label: '2 osobe' },
    { value: '3', label: '3 osobe' },
    { value: '4', label: '4 osobe' },
    { value: '5', label: '5 osoba' },
    { value: '6', label: '6 osoba' },
    { value: '7', label: '7 osoba' },
    { value: '8', label: '8 osoba' },
    { value: '9', label: '9 osoba' },
    { value: '10', label: '10 osoba' }
]

function handleSearch(criteria: { size: string; date: string; time: string }) {
    displayedSize.value = criteria.size
    displayedDate.value = parseQueryDate(criteria.date)
    displayedTime.value = criteria.time

    router.push({ query: criteria })
    store.initializeSearch(criteria)
}

function handleBack() {
    router.push('/')
}

onMounted(() => {
    if (route.query.size && route.query.date && route.query.time) {
        const criteria = {
            size: route.query.size.toString(),
            date: route.query.date.toString(),
            time: route.query.time.toString()
        }
        displayedDate.value = parseQueryDate(criteria.date)
        displayedSize.value = criteria.size
        displayedTime.value = criteria.time
        store.initializeSearch(criteria)
    }
})
</script>

<script lang="ts">
export default { name: 'SearchView' }
</script>

<template>
    <div class="font-inter">
        <!-- Header -->
        <header class="bg-white shadow-sm fixed w-full top-0 z-50">
            <div class="max-w-7xl mx-auto px-4">
                <div class="flex items-center justify-between py-4">
                    <button @click="handleBack" class="text-gray-600 hover:text-gray-900 flex">
                        <ChevronLeftIcon class="w-6 h-6" /> Nazad
                    </button>
                    <img src="https://ontopo.com/assets/imgs/general/logo.svg" alt="Ontopo" class="h-8 md:h-10">
                    <div class="w-6"></div>
                </div>
            </div>
        </header>

        <!-- Main Content -->
        <main class="bg-[#CCE6FF] pt-16 min-h-screen">
            <div class="max-w-7xl mx-auto px-4 pb-5">
                <!-- Search Form -->
                <div class="py-6">
                    <SearchForm :on-search="handleSearch" v-model:size="selectedSize" v-model:date="selectedDate"
                        v-model:time="selectedTime" />
                </div>

                <!-- Results -->
                <div class="bg-white rounded-2xl shadow-xl p-6 sm:p-8">
                    <!-- Prikaz izabranih kriterijuma -->
                    <div class="mb-8 pb-6 border-b border-gray-200">
                        <h2 class="text-2xl font-semibold mb-4">Rezultati pretrage</h2>
                        <div class="flex gap-6 text-gray-600">
                            <div class="flex items-center gap-1">
                                <UserIcon class="w-5 h-5" />
                                <span>{{ partySizes.find(s => s.value === displayedSize)?.label }}</span>
                            </div>
                            <div class="flex items-center gap-1">
                                <CalendarIcon class="w-5 h-5" />
                                <span>{{ formatDate(displayedDate) }}</span>
                            </div>
                            <div class="flex items-center gap-1">
                                <ClockIcon class="w-5 h-5" />
                                <span>{{ getTimeLabel(displayedTime) }}</span>
                            </div>
                        </div>
                    </div>

                    <!-- Lista restorana -->
                    <RestaurantList :restaurants="store.restaurants" :has-more="store.restaurants.length < store.total"
                        :loading="store.isLoading" :is-initial-load="!store.restaurants.length"
                        :requested-time="displayedTime" @load-more="store.loadMore" />
                </div>
            </div>
        </main>
    </div>
</template>

<style>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

@keyframes shake {

    0%,
    100% {
        transform: translateX(0);
    }

    25% {
        transform: translateX(-8px);
    }

    75% {
        transform: translateX(8px);
    }
}

.animate-shake {
    animation: shake 0.5s ease-in-out;
}

.animate-fade-in {
    animation: fadeIn 0.5s ease-out;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(20px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}
</style>