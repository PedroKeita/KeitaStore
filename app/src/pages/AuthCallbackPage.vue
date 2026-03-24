<template>
  <div class="min-h-screen bg-[#0a0c10] text-white flex items-center justify-center">
    <div class="flex flex-col items-center gap-4">
      <div class="w-12 h-12 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
      <p class="text-white/50 text-sm">Finalizando login...</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/useAuthStore'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

onMounted(async () => {
  const token = route.query.token as string

  if (!token) {
    router.push({ name: 'login' })
    return
  }

  authStore.setUser({ token, user: {} as any })

  await authStore.fetchMe()

  const redirect = localStorage.getItem('redirectAfterLogin')
  localStorage.removeItem('redirectAfterLogin')
  router.push(redirect ?? '/')
})
</script>