<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

function goHome() {
    router.push('/')
}
</script>

<template>
    <div class="min-h-screen bg-[#CCE6FF] flex items-center justify-center px-4">
        <div class="text-center">
            <h1 class="text-9xl font-bold text-gray-900 mb-4">404</h1>
            <p class="text-xl text-gray-600 mb-8">Ups! Stranica koju tražite ne postoji.</p>
            <button @click="goHome"
                class="bg-black text-white px-6 py-3 rounded-lg text-lg font-medium hover:bg-gray-800 transition-colors duration-200">
                Nazad na početnu
            </button>
        </div>
    </div>
</template>