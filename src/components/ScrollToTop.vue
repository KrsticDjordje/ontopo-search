<template>
    <Transition name="fade">
        <button v-show="showButton" @click="scrollToTop"
            class="fixed bottom-8 right-8 bg-black bg-opacity-80 text-white p-3 rounded-full shadow-lg hover:bg-opacity-100 transition-all duration-200 z-50">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
        </button>
    </Transition>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const showButton = ref(false)

onMounted(() => {
    window.addEventListener('scroll', () => {
        showButton.value = window.scrollY > 500
    })
})

function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    })
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>