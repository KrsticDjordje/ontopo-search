<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import CustomDropdown from '../components/CustomDropdown.vue'

const props = defineProps<{
    onSearch: (criteria: { size: string; date: string; time: string }) => void
    size: string
    date: string
    time: string
}>()

const emit = defineEmits<{
    'update:size': [string]
    'update:date': [string]
    'update:time': [string]
}>()

const selectedSize = computed({
    get: () => props.size,
    set: (value) => emit('update:size', value)
})

const selectedDate = computed({
    get: () => props.date,
    set: (value) => emit('update:date', value)
})

const selectedTime = computed({
    get: () => props.time,
    set: (value) => emit('update:time', value)
})

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

// Helper funkcija za proveru vremena
function getAvailableTimeOptions(): { value: string; label: string; }[] {
    const now = new Date()
    const currentHour = now.getHours()
    const selectedDateIsToday = selectedDate.value === new Date().toISOString().split('T')[0]

    return Array.from({ length: 24 }, (_, hour) => {
        const h = hour + 12
        if (h > 23) return []

        if (selectedDateIsToday && h <= currentHour + 2) return []

        return [
            { value: `${h.toString().padStart(2, '0')}00`, label: `${h}:00` },
            { value: `${h.toString().padStart(2, '0')}30`, label: `${h}:30` }
        ]
    }).flat().filter(Boolean)
}

const timeOptions = computed(() => getAvailableTimeOptions())

watch(selectedDate, () => {
    const availableTimes = getAvailableTimeOptions()
    if (!availableTimes.some(t => t.value === selectedTime.value)) {
        selectedTime.value = availableTimes[0]?.value || '2000'
    }
})

function handleSearch() {
    const formattedDate = selectedDate.value.replace(/-/g, '')
    props.onSearch({
        size: selectedSize.value,
        date: formattedDate,
        time: selectedTime.value
    })
}
</script>

<template>
    <div class="bg-white rounded-xl p-4 flex flex-col md:flex-row gap-4 md:gap-0 shadow-lg">
        <!-- Broj osoba -->
        <div class="w-full md:w-auto md:flex-1 md:px-3">
            <CustomDropdown v-model="selectedSize" :options="partySizes" placeholder="Izaberite broj osoba" />
        </div>

        <!-- Datum -->
        <div class="w-full md:w-auto md:flex-1 md:px-3 md:border-x md:border-gray-200">
            <input type="date" v-model="selectedDate"
                class="w-full appearance-none bg-transparent text-left px-4 py-4 text-base md:text-lg cursor-pointer focus:outline-none"
                :min="new Date().toISOString().split('T')[0]">
        </div>

        <!-- Vreme -->
        <div class="w-full md:w-auto md:flex-1 md:px-3">
            <CustomDropdown v-model="selectedTime" :options="timeOptions"
                :placeholder="timeOptions[0]?.label || 'Izaberite vreme'" />
        </div>

        <!-- Search Button -->
        <button @click="handleSearch"
            class="w-full md:w-auto bg-black text-white px-6 md:px-10 py-4 rounded-lg text-base md:text-lg font-medium hover:bg-gray-800 transition-colors duration-200">
            Pretraži
        </button>
    </div>
</template>

<script lang="ts">
export default {
    name: 'SearchForm'
}
</script>