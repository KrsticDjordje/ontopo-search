import { computed } from 'vue'

export function useTimeManagement(selectedDate: any) {
    // Vraca danasnji datum u formatu YYYY-MM-DD za Beograd
    function getTodayDate(): string {
        const now = new Date()
        const bgTime = new Date(now.toLocaleString('en-US', { timeZone: 'Europe/Belgrade' }))
        return bgTime.toISOString().split('T')[0]
    }

    // Vraca danasnji datum ili sutra ako je proslo radno vreme (22h)
    function getTodayOrNextDay(): string {
        const now = new Date()
        const bgTime = new Date(now.toLocaleString('en-US', { timeZone: 'Europe/Belgrade' }))
        const currentHour = bgTime.getHours()

        if (currentHour >= 22) {
            const tomorrow = new Date(bgTime)
            tomorrow.setDate(tomorrow.getDate() + 1)
            return tomorrow.toISOString().split('T')[0]
        }

        return bgTime.toISOString().split('T')[0]
    }

    // Proverava da li je prosledjeni datum danasnji
    function isToday(date: string): boolean {
        const now = new Date()
        const bgTime = new Date(now.toLocaleString('en-US', { timeZone: 'Europe/Belgrade' }))
        return date === bgTime.toISOString().split('T')[0]
    }

    // Generise vremenske slotove za odredjeni sat (HH:00 i HH:30)
    function generateTimeSlots(startHour: number): { value: string; label: string }[] {
        const slots: { value: string; label: string }[] = []
        for (let hour = startHour; hour <= 23; hour++) {
            slots.push({
                value: `${hour.toString().padStart(2, '0')}00`,
                label: `${hour}:00`
            })
            slots.push({
                value: `${hour.toString().padStart(2, '0')}30`,
                label: `${hour}:30`
            })
        }
        return slots
    }

    // Generise sve vremenske slotove od 8h do 23h
    function generateAllTimeSlots(): { value: string; label: string }[] {
        return generateTimeSlots(8) // Radno vreme od 8h do 23h
    }

    // Vraca dostupne termine za izabrani datum
    // - Za buduci datum: svi termini od 8-23h
    // - Za danas: termini od (trenutno_vreme + 1h) do 23h
    // - Posle 22h nema termina za danas
    function getAvailableTimeSlots(): { value: string; label: string }[] {
        if (!isToday(selectedDate.value)) {
            return generateAllTimeSlots()
        }

        const now = new Date()
        const bgTime = new Date(now.toLocaleString('en-US', { timeZone: 'Europe/Belgrade' }))
        const currentHour = bgTime.getHours()

        if (currentHour >= 22) return []
        const startHour = currentHour + 1
        return generateTimeSlots(startHour)
    }

    // Computed property koja vraca trenutno dostupne termine
    const timeOptions = computed(() => getAvailableTimeSlots())

    // Eksport
    return {
        getTodayDate,
        getTodayOrNextDay,
        isToday,
        getAvailableTimeSlots,
        timeOptions
    }
} 