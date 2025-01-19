<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
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

// Helper za proveru da li treba prikazati sutrašnji dan
function shouldShowNextDay(): boolean {
    const now = new Date()
    const currentHour = now.getHours()
    const currentMinutes = now.getMinutes()
    return currentHour >= 21 || (currentHour === 20 && currentMinutes > 30)
}

// Inicijalno postavljanje datuma
function getInitialDate(): string {
    if (shouldShowNextDay()) {
        const tomorrow = new Date()
        tomorrow.setDate(tomorrow.getDate() + 1)
        return tomorrow.toISOString().split('T')[0]
    }
    return new Date().toISOString().split('T')[0]
}

// Postavljamo inicijalne vrednosti
const selectedDate = computed({
    get: () => props.date || getInitialDate(),
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

// Helper funkcija za proveru vremena i datuma
function getAvailableTimeOptions(): { value: string; label: string; }[] {
    const now = new Date()
    const currentHour = now.getHours()
    const currentMinutes = now.getMinutes()
    const selectedDateIsToday = selectedDate.value === new Date().toISOString().split('T')[0]

    // Ako je manje od 2h do kraja radnog vremena (23:00)
    if (selectedDateIsToday && (currentHour >= 21 || (currentHour === 20 && currentMinutes > 30))) {
        const tomorrow = new Date()
        tomorrow.setDate(tomorrow.getDate() + 1)
        selectedDate.value = tomorrow.toISOString().split('T')[0]
        // Vraćamo pun raspored za sutra
        return generateFullSchedule()
    }

    // Za današnji dan, prikazujemo samo dostupne termine (2h unapred)
    if (selectedDateIsToday) {
        const minHour = currentHour + 2
        const minMinutes = currentMinutes
        const availableSlots = generateScheduleFromTime(minHour, minMinutes)

        // Ako nema dostupnih termina za danas, prebacujemo na sutra
        if (availableSlots.length === 0) {
            const tomorrow = new Date()
            tomorrow.setDate(tomorrow.getDate() + 1)
            selectedDate.value = tomorrow.toISOString().split('T')[0]
            return generateFullSchedule()
        }

        return availableSlots
    }

    // Za buduće datume, prikazujemo sve termine
    return generateFullSchedule()
}

// Helper za generisanje punog rasporeda (8:00-23:00)
function generateFullSchedule(): { value: string; label: string; }[] {
    const schedule: { value: string; label: string; }[] = []

    for (let hour = 8; hour <= 23; hour++) {
        // Dodajemo pun sat
        schedule.push({
            value: `${hour.toString().padStart(2, '0')}00`,
            label: `${hour}:00`
        })
        // Dodajemo pola sata
        schedule.push({
            value: `${hour.toString().padStart(2, '0')}30`,
            label: `${hour}:30`
        })
    }

    return schedule
}

// Helper za generisanje rasporeda od određenog vremena
function generateScheduleFromTime(hour: number, minutes: number): { value: string; label: string; }[] {
    const schedule: { value: string; label: string; }[] = []

    for (let h = hour; h <= 23; h++) {
        // Za prvi sat proveravamo minute
        if (h === hour) {
            // Ako je prošlo pola sata, dodajemo samo :30
            if (minutes <= 30) {
                schedule.push({
                    value: `${h.toString().padStart(2, '0')}30`,
                    label: `${h}:30`
                })
            }
            continue
        }

        // Za ostale sate dodajemo oba termina
        schedule.push({
            value: `${h.toString().padStart(2, '0')}00`,
            label: `${h}:00`
        })
        schedule.push({
            value: `${h.toString().padStart(2, '0')}30`,
            label: `${h}:30`
        })
    }

    return schedule
}

const timeOptions = computed(() => getAvailableTimeOptions())

watch(selectedDate, () => {
    const availableTimes = getAvailableTimeOptions()
    if (!availableTimes.some(t => t.value === selectedTime.value)) {
        selectedTime.value = availableTimes[0]?.value || '2000'
    }
})

// Postavljamo inicijalno vreme
onMounted(() => {
    const availableTimes = getAvailableTimeOptions()
    if (availableTimes.length > 0) {
        emit('update:time', availableTimes[0].value)
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
export default {
    name: 'SearchForm'
}
</script>