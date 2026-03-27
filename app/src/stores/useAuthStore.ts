import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User } from '@/types'
import { apiFetch } from '@/services/api'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const token = ref<string | null>(localStorage.getItem('token'))
  const isLoading = ref(false)

  const isAuthenticated = computed(() => !!token.value)

  function setUser(data: { token: string; user: User }) {
    token.value = data.token
    user.value = data.user
     localStorage.setItem('token', data.token)
    localStorage.setItem('user', JSON.stringify(data.user))
  }

 async function fetchMe() {
  if (!token.value) return

  isLoading.value = true

  try {
    const data = await apiFetch('/auth/me')
    user.value = data
  } catch {
    logout()
  } finally {
    isLoading.value = false
  }
}
function loadUserFromStorage() {
  const storedUser = localStorage.getItem('user')
  if (storedUser) {
    user.value = JSON.parse(storedUser)
  }
}

  function logout() {
  const userId = user.value?.id

  user.value = null
  token.value = null
  localStorage.removeItem('token')
  localStorage.removeItem('user')

  if (userId) {
    localStorage.removeItem(`cart_${userId}`)
    localStorage.removeItem(`wishlist_${userId}`)
  }
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
    isLoading,
    setUser,
    fetchMe,
    logout,
    updateName,
    loadUserFromStorage
  }
})