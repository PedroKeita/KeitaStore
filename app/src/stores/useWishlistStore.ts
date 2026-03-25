import { defineStore } from 'pinia'
import { computed } from 'vue'
import type { Product } from '@/types'
import { useStorage } from '@vueuse/core'

export const useWishlistStore = defineStore('wishlist', () => {
  const items = useStorage<Product[]>('wishlist', [])

  const totalItems = computed(() => items.value.length)

  function toggle(product: Product) {
    const index = items.value.findIndex(p => p.id === product.id)
    if (index >= 0) {
      items.value.splice(index, 1)
    } else {
      items.value.push(product)
    }
  }

  function isFavorite(productId: string) {
    return items.value.some(p => p.id === productId)
  }

  function clear() {
  items.value = []
  }

  return { items, totalItems, toggle, isFavorite, clear }

})

