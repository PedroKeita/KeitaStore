import { defineStore } from 'pinia'
import { computed } from 'vue'
import { useAuthStore } from '@/stores/useAuthStore'
import type { CartItem, Product } from '@/types'

export const useCartStore = defineStore('cart', () => {
  const authStore = useAuthStore()

  const storageKey = computed(() =>
    authStore.user ? `cart_${authStore.user.id}` : null
  )

  const items = computed(() => {
    if (!storageKey.value) return []
    const raw = localStorage.getItem(storageKey.value)
    return raw ? (JSON.parse(raw) as CartItem[]) : []
  })

  const totalItems = computed(() =>
    items.value.reduce((acc, item) => acc + item.quantity, 0)
  )

  const subtotal = computed(() =>
    items.value.reduce((acc, item) => acc + item.product.price * item.quantity, 0)
  )

  const shipping = computed(() => (subtotal.value >= 299 ? 0 : 19.9))

  const total = computed(() => subtotal.value + shipping.value)

  function save(newItems: CartItem[]) {
    if (!storageKey.value) return
    localStorage.setItem(storageKey.value, JSON.stringify(newItems))
  }

  function addItem(product: Product, quantity = 1) {
    if (!authStore.isAuthenticated) {
      throw new Error('unauthenticated')
    }
    const current = [...items.value]
    const existing = current.find(i => i.product.id === product.id)
    if (existing) {
      existing.quantity += quantity
    } else {
      current.push({ product, quantity })
    }
    save(current)
  }

  function removeItem(productId: string) {
    save(items.value.filter(i => i.product.id !== productId))
  }

  function updateQuantity(productId: string, quantity: number) {
    if (quantity <= 0) {
      removeItem(productId)
      return
    }
    const current = items.value.map(i =>
      i.product.id === productId ? { ...i, quantity } : i
    )
    save(current)
  }

  function clear() {
    if (!storageKey.value) return
    localStorage.removeItem(storageKey.value)
  }

  return { items, totalItems, subtotal, shipping, total, addItem, removeItem, updateQuantity, clear }
})