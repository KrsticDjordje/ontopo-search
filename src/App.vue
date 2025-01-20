<script setup lang="ts">
import { RouterView } from 'vue-router'
import ScrollToTop from './components/ScrollToTop.vue'
</script>

<script lang="ts">
export default { name: 'App' }
</script>

<template>
  <RouterView />
  <ScrollToTop />
</template>

<style>
#app {
  margin: 0 auto;
  font-weight: normal;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
