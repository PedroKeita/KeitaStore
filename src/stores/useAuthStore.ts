import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User } from '@/types'

const MOCK_USER: User = {
  id: '1',
  name: 'João Silva',
  email: 'joao.silva@gmail.com',
  avatar: 'https://i.pravatar.cc/150?img=8',
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)

  const isAuthenticated = computed(() => !!user.value)

  function login() {
    // Simula o fluxo OAuth Google
    user.value = MOCK_USER
  }

  function logout() {
    user.value = null
  }

  return { user, isAuthenticated, login, logout }
})