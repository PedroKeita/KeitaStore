import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User } from '@/types'
import { authService } from '@/services/auth.service'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const loading = ref(false)

  const isAuthenticated = computed(() => !!user.value)

  async function loginWithGoogle() {
    loading.value = true
    try {
      user.value = await authService.loginWithGoogle()
    } finally {
      loading.value = false
    }
  }

  async function logout() {
    loading.value = true
    try {
      await authService.logout()
      user.value = null
    } finally {
      loading.value = false
    }
  }

  return { user, loading, isAuthenticated, loginWithGoogle, logout }
})