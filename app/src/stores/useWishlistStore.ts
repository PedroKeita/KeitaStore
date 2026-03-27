import { defineStore } from 'pinia'
import { computed } from 'vue'
import { useStorage } from '@vueuse/core'
import { useAuthStore } from '@/stores/useAuthStore'
import type { Product } from '@/types'

export const useWishlistStore = defineStore('wishlist', () => {
  const authStore = useAuthStore()

  const storageKey = computed(() =>
    authStore.user ? `wishlist_${authStore.user.id}` : null
  )

  const items = computed(() => {
    if (!storageKey.value) return []
    const raw = localStorage.getItem(storageKey.value)
    return raw ? (JSON.parse(raw) as Product[]) : []
  })

  const totalItems = computed(() => items.value.length)

  function save(newItems: Product[]) {
    if (!storageKey.value) return
    localStorage.setItem(storageKey.value, JSON.stringify(newItems))
  }

  function toggle(product: Product) {
    if (!authStore.isAuthenticated) {
      throw new Error('unauthenticated')
    }
    const current = [...items.value]
    const index = current.findIndex(p => p.id === product.id)
    if (index >= 0) {
      current.splice(index, 1)
    } else {
      current.push(product)
    }
    save(current)
  }

  function isFavorite(productId: string) {
    return items.value.some(p => p.id === productId)
  }

  function clear() {
    if (!storageKey.value) return
    localStorage.removeItem(storageKey.value)
  }

  return { items, totalItems, toggle, isFavorite, clear }
})