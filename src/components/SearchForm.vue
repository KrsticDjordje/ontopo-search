<script setup lang="ts">
import { computed } from 'vue'
import CustomDropdown from '../components/CustomDropdown.vue'
import { useTimeManagement } from '@/composables/useTimeManagement'

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

// Computed properties za v-model
const selectedSize = computed({
    get: () => props.size,
    set: (value) => emit('update:size', value)
})

const selectedDate = computed({
    get: () => props.date || getTodayDate(),
    set: (value) => {
        emit('update:date', value)
        // Kada se promeni datum, proveri dostupna vremena
        const availableSlots = getAvailableTimeSlots()
        if (availableSlots.length === 0 && isToday(value)) {
            // Ako nema dostupnih termina za danas, prebaci na sutra
            const tomorrow = new Date()
            tomorrow.setDate(tomorrow.getDate() + 1)
            emit('update:date', tomorrow.toISOString().split('T')[0])
        }
    }
})

const selectedTime = computed({
    get: () => {
        // Proveri dostupne termine
        const availableSlots = getAvailableTimeSlots()
        if (availableSlots.length === 0 && isToday(selectedDate.value)) {
            // Ako nema termina za danas, prebaci na sutra
            const tomorrow = new Date()
            tomorrow.setDate(tomorrow.getDate() + 1)
            emit('update:date', tomorrow.toISOString().split('T')[0])
            return '2000' // Default vreme za novi dan
        }
        // Ako nema prosleđenog vremena ili nije dostupno, uzmi prvo dostupno
        if (!props.time || !availableSlots.find(slot => slot.value === props.time)) {
            return availableSlots[0]?.value || '2000'
        }
        return props.time
    },
    set: (value) => emit('update:time', value)
})

const { getTodayDate, isToday, getAvailableTimeSlots, timeOptions } = useTimeManagement(selectedDate)

// Opcije za dropdown-ove
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

// Event handlers
function handleSearch() {
    const formattedDate = selectedDate.value.replace(/-/g, '')
    const formattedTime = selectedTime.value.padStart(4, '0')

    props.onSearch({
        size: selectedSize.value,
        date: formattedDate,
        time: formattedTime
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
                class="w-full appearance-none bg-gray-50 sm:bg-transparent text-left px-4 py-4 text-base md:text-lg cursor-pointer focus:outline-none"
                :min="getTodayDate()">
        </div>

        <!-- Vreme -->
        <div class="w-full md:w-auto md:flex-1 md:px-3">
            <CustomDropdown v-model="selectedTime" :options="timeOptions"
                :placeholder="timeOptions[0]?.label || '20:00'" />
        </div>

        <!-- Search Button -->
        <button @click="handleSearch"
            class="w-full md:w-auto bg-black text-white px-6 md:px-10 py-4 rounded-lg text-base md:text-lg font-medium hover:bg-gray-800 transition-colors duration-200">
            Pretraži
        </button>
    </div>
</template>

<script lang="ts">
export default { name: 'SearchForm' }
</script>
