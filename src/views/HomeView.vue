<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import SearchForm from '../components/SearchForm.vue'

const router = useRouter()

function getTodayOrNextDay(): string {
    const now = new Date()
    const bgTime = new Date(now.toLocaleString('en-US', { timeZone: 'Europe/Belgrade' }))
    const currentHour = bgTime.getHours()

    // Ako je nakon 22h, postavi datum na sutrašnji datum
    if (currentHour >= 22) {
        const tomorrow = new Date(bgTime)
        tomorrow.setDate(tomorrow.getDate() + 1)
        return tomorrow.toISOString().split('T')[0]
    }

    return bgTime.toISOString().split('T')[0]
}

// Inicijalne vrednosti za formu
const selectedSize = ref('2')
const selectedDate = ref(getTodayOrNextDay())
const selectedTime = ref('')

function handleSearch(criteria: { size: string; date: string; time: string }) {
    router.push({
        name: 'search',
        query: {
            size: criteria.size,
            date: criteria.date,
            time: criteria.time
        }
    })
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
        <main class="bg-[#CCE6FF] h-screen content-center">
            <div class="max-w-7xl mx-auto px-4 pb-5">
                <!-- Landing sekcija -->
                <div class="pt-8 pb-2">
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

                        <!-- Image sekcija -->
                        <div class="hidden md:block flex-1 justify-center items-center">
                            <img src="https://res.cloudinary.com/ontopo/image/upload/q_auto:eco,c_crop,x_0,y_0,w_1080,h_1080/w_750/v1708860226/assets/654b43cd4f616f00143332e3/654b43cd4f616f00143332e3/2.png"
                                alt="Food plate" class="w-full rounded-full">
                        </div>
                    </div>
                </div>
            </div>
        </main>
    </div>
</template>