<template>
  <div class="min-h-screen bg-[#0a0c10]">
    <AppHeader />
    <RouterView />
  </div>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import AppHeader from '@/components/AppHeader.vue'
</script>