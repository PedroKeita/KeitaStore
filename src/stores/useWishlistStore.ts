import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Product } from '@/types'

export const useWishlistStore = defineStore('wishlist', () => {
  const items = ref<Product[]>([])

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

  return { items, totalItems, toggle, isFavorite }
})