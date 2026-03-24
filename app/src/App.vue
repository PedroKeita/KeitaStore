<template>
  <div class="min-h-screen bg-[#0a0c10]">
    <AppHeader />
    <RouterView />
    <AppToast />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { RouterView } from 'vue-router'
import AppHeader from '@/components/AppHeader.vue'
import AppToast from '@/components/AppToast.vue'
import { useAuthStore } from '@/stores/useAuthStore'

const authStore = useAuthStore()

onMounted(() => {
  authStore.fetchMe()
})
</script>