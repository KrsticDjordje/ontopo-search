<script setup lang="ts">
import { ref, nextTick, computed } from 'vue'
import { useRestaurantStore } from '../stores/restaurant'
import RestaurantList from '../components/RestaurantList.vue'
import SearchForm from '../components/SearchForm.vue'

const store = useRestaurantStore()
const showResults = ref(false)
const resultsRef = ref<HTMLElement | null>(null)
const selectedSize = ref('2')
const selectedDate = ref(new Date().toISOString().split('T')[0])
const selectedTime = ref('2000')

// Helper za formatiranje datuma
function formatDate(date: string): string {
    if (date === new Date().toISOString().split('T')[0]) return 'Danas'
    const d = new Date(date)
    return d.toLocaleDateString('sr-RS', { day: 'numeric', month: 'long' })
}

// Opcije za vreme - prebačeno iz SearchForm
function getTimeLabel(time: string): string {
    return `${time.slice(0, 2)}:${time.slice(2)}`
}

// Opcije za broj osoba
const partySizes = [
    { value: '1', label: '1 osoba' },
    { value: '2', label: '2 osobe' },
    // ... ostale opcije
]

async function handleSearch(criteria: { size: string; date: string; time: string }) {
    showResults.value = true

    await nextTick()
    if (resultsRef.value) {
        resultsRef.value.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        })
    }

    await store.initializeSearch(criteria)
}
</script>

<template>
    <div class="font-inter">
        <!-- Header -->
        <header class="bg-white shadow-sm fixed w-full top-0 z-50">
            <div class="max-w-7xl mx-auto px-4">
                <div class="flex justify-center py-4">
                    <img src="https://ontopo.com/assets/imgs/general/logo.svg" alt="Ontopo" class="h-8 md:h-10">
                </div>
            </div>
        </header>

        <!-- Main Content -->
        <main class="bg-[#CCE6FF] pt-16">
            <div class="max-w-7xl mx-auto px-4">
                <!-- Landing sekcija -->
                <div class="pt-14 pb-5">
                    <div class="flex flex-col md:flex-row items-center md:gap-12">
                        <!-- Text i Search sekcija -->
                        <div class="flex-2 md:max-w-2xl">
                            <h1 class="text-4xl md:text-6xl font-bold text-gray-900 mb-4 md:mb-6 leading-tight">
                                Kulinarsko iskustvo u Beogradu
                            </h1>
                            <p class="text-base md:text-lg text-gray-600 mb-8 md:mb-14">
                                Oseti njegov duh gde svaki zalogaj otkriva priču o tradiciji i inovaciji.
                                Neka gastronomija Beograda probudi sva tvoja čula i učini da želiš još.
                            </p>
                            <SearchForm :on-search="handleSearch" v-model:size="selectedSize"
                                v-model:date="selectedDate" v-model:time="selectedTime" />
                        </div>

                        <!-- Image sekcija - sakrivena na mobilnim uređajima -->
                        <div class="hidden md:block flex-1">
                            <img src="https://res.cloudinary.com/ontopo/image/upload/q_auto:eco,c_crop,x_0,y_0,w_1080,h_1080/w_750/v1708860226/assets/654b43cd4f616f00143332e3/654b43cd4f616f00143332e3/2.png"
                                alt="Food plate" class="w-full rounded-full">
                        </div>
                    </div>
                </div>

                <!-- Rezultati pretrage -->
                <Transition enter-active-class="transition duration-500 ease-out"
                    enter-from-class="transform translate-y-10 opacity-0"
                    enter-to-class="transform translate-y-0 opacity-100"
                    leave-active-class="transition duration-300 ease-in"
                    leave-from-class="transform translate-y-0 opacity-100"
                    leave-to-class="transform translate-y-10 opacity-0">
                    <div v-if="showResults" ref="resultsRef" class="mt-8 bg-white rounded-2xl shadow-xl p-8">
                        <!-- Prikaz izabranih kriterijuma -->
                        <div class="mb-8 pb-6 border-b border-gray-200">
                            <h2 class="text-2xl font-semibold mb-4">Rezultati pretrage</h2>
                            <div class="flex gap-6 text-gray-600">
                                <div class="flex items-center gap-1">
                                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" stroke-width="2"
                                            stroke-linecap="round" />
                                        <circle cx="9" cy="7" r="4" stroke-width="2" stroke-linecap="round" />
                                    </svg>
                                    <span>{{ partySizes.find(s => s.value === selectedSize)?.label }}</span>
                                </div>
                                <div class="flex items-center gap-1">
                                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <rect x="3" y="4" width="18" height="18" rx="2" stroke-width="2" />
                                        <path d="M16 2v4M8 2v4M3 10h18" stroke-width="2" stroke-linecap="round" />
                                    </svg>
                                    <span>{{ formatDate(selectedDate) }}</span>
                                </div>
                                <div class="flex items-center gap-1">
                                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <circle cx="12" cy="12" r="10" stroke-width="2" />
                                        <path d="M12 6v6l4 2" stroke-width="2" stroke-linecap="round" />
                                    </svg>
                                    <span>{{ getTimeLabel(selectedTime) }}</span>
                                </div>
                            </div>
                        </div>

                        <!-- Lista restorana -->
                        <RestaurantList :restaurants="store.restaurants"
                            :has-more="store.restaurants.length < store.total" :loading="store.isLoading"
                            :is-initial-load="!store.restaurants.length" :requested-time="selectedTime"
                            @load-more="store.loadMore" />
                    </div>
                </Transition>
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