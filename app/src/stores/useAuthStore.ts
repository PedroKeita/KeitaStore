import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User } from '@/types'
import { apiFetch } from '@/services/api'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const token = ref<string | null>(localStorage.getItem('token'))

  const isAuthenticated = computed(() => !!token.value)

  function setUser(data: { token: string; user: User }) {
    token.value = data.token
    user.value = data.user
    localStorage.setItem('token', data.token)
  }

  async function fetchMe() {
    if (!token.value) return

    try {
      const data = await apiFetch('/auth/me')
      user.value = data
    } catch {
      logout()
    }
  }

  function logout() {
    user.value = null
    token.value = null
    localStorage.removeItem('token')
  }

  async function updateName(name: string) {
    if (!user.value) return

    try {
      const updated = await apiFetch('/user/me', {
        method: 'PUT',
        body: JSON.stringify({ name }),
      })

      user.value = { ...user.value, name: updated.name }
    } catch (err) {
      console.error(err)
    }
  }

  return {
    user,
    token,
    isAuthenticated,
    setUser,
    fetchMe,
    logout,
    updateName
  }
})