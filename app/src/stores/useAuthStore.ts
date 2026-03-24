import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User } from '@/types'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const token = ref<string | null>(localStorage.getItem('token'))

  const isAuthenticated = computed(() => !!token.value)

  function setUser(data: { token: string; name: string; email: string; avatar: string }) {
    token.value = data.token
    user.value = {
      id: '',
      name: data.name,
      email: data.email,
      avatar: data.avatar,
    }
    localStorage.setItem('token', data.token)
  }

  async function fetchMe() {
    if (!token.value) return
    try {
      const res = await fetch('http://localhost:3000/auth/me', {
        headers: { Authorization: `Bearer ${token.value}` },
      })
      if (!res.ok) { logout(); return }
      const data = await res.json()
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

  return { user, token, isAuthenticated, setUser, fetchMe, logout }
})