<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { ChevronDownIcon } from '@heroicons/vue/24/outline'

interface DropdownOption {
    value: string
    label: string
    disabled?: boolean
}

const props = defineProps<{
    modelValue: string
    options: DropdownOption[]
    placeholder?: string
}>()

const emit = defineEmits<{
    'update:modelValue': [value: string]
}>()

const isOpen = ref(false)
const dropdownRef = ref<HTMLDivElement | null>(null)

const selectedLabel = computed(() =>
    props.options.find(opt => opt.value === props.modelValue)?.label || props.placeholder
)

const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
        isOpen.value = false
    }
}

onMounted(() => document.addEventListener('click', handleClickOutside))
onUnmounted(() => document.removeEventListener('click', handleClickOutside))
</script>

<template>
    <div ref="dropdownRef" class="custom-dropdown">
        <button @click="isOpen = !isOpen" type="button"
            class="dropdown-toggle w-full px-4 py-4 text-lg text-left bg-gray-50 sm:bg-transparent hover:bg-gray-50 transition-colors duration-200 rounded-lg focus:outline-none">
            <span class="block truncate">{{ selectedLabel || placeholder }}</span>
            <span class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <ChevronDownIcon class="w-4 h-4 transition-transform duration-200" :class="{ 'rotate-180': isOpen }" />
            </span>
        </button>

        <transition enter-active-class="transition duration-100 ease-out"
            enter-from-class="transform scale-95 opacity-0" enter-to-class="transform scale-100 opacity-100"
            leave-active-class="transition duration-75 ease-in" leave-from-class="transform scale-100 opacity-100"
            leave-to-class="transform scale-95 opacity-0">
            <div v-if="isOpen"
                class="absolute z-10 w-full mt-1 bg-white rounded-lg shadow-lg max-h-60 overflow-auto focus:outline-none">
                <div class="py-1">
                    <button v-for="option in options" :key="option.value" @click="() => {
                        if (!option.disabled) {
                            emit('update:modelValue', option.value);
                            isOpen = false;
                        }
                    }" :disabled="option.disabled" :class="[
                        'w-full text-left px-4 py-3 text-lg transition-colors duration-200',
                        option.value === modelValue ? 'bg-gray-50 text-gray-900' : 'text-gray-700',
                        option.disabled ? 'opacity-50 cursor-not-allowed bg-gray-100' : 'hover:bg-gray-100'
                    ]">
                        {{ option.label }}
                    </button>
                </div>
            </div>
        </transition>
    </div>
</template>

<style scoped>
.custom-dropdown {
    @apply relative;
}

.dropdown-toggle {
    @apply relative w-full cursor-pointer text-left;
}

.custom-dropdown div::-webkit-scrollbar {
    width: 6px;
}

.custom-dropdown div::-webkit-scrollbar-track {
    @apply bg-gray-100 rounded-full;
}

.custom-dropdown div::-webkit-scrollbar-thumb {
    @apply bg-gray-300 rounded-full hover:bg-gray-400 transition-colors duration-200;
}
</style>