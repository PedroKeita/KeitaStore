import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import { useAuthStore } from '@/stores/useAuthStore'
import type { Product } from '@/types'

export const useWishlistStore = defineStore('wishlist', () => {
  const authStore = useAuthStore()

  const items = ref<Product[]>([])

  const storageKey = computed(() =>
    authStore.user ? `wishlist_${authStore.user.id}` : null
  )

  
  watch(
    () => authStore.user,
    (user) => {
      if (!user) {
        items.value = []
        return
      }

      const key = `wishlist_${user.id}`
      const raw = localStorage.getItem(key)
      items.value = raw ? JSON.parse(raw) : []
    },
    { immediate: true }
  )

  const totalItems = computed(() => items.value.length)

  function save() {
    if (!storageKey.value) return
    localStorage.setItem(storageKey.value, JSON.stringify(items.value))
  }

  function toggle(product: Product) {
    if (!authStore.isAuthenticated) {
      throw new Error('unauthenticated')
    }

    const index = items.value.findIndex(p => p.id === product.id)

    if (index >= 0) {
      items.value.splice(index, 1)
    } else {
      items.value.push(product)
    }

    save()
  }

  function isFavorite(productId: string) {
    return items.value.some(p => p.id === productId)
  }

  function clear() {
    if (!storageKey.value) return
    items.value = []
    localStorage.removeItem(storageKey.value)
  }

  return { items, totalItems, toggle, isFavorite, clear }
})