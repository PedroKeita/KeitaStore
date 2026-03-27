import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import { useAuthStore } from '@/stores/useAuthStore'
import type { CartItem, Product } from '@/types'

export const useCartStore = defineStore('cart', () => {
  const authStore = useAuthStore()

  const items = ref<CartItem[]>([])

  const storageKey = computed(() =>
    authStore.user ? `cart_${authStore.user.id}` : null
  )

  
  watch(
  () => authStore.user,
  (user) => {
    if (!user) return

    const key = `cart_${user.id}`
    const raw = localStorage.getItem(key)
    items.value = raw ? JSON.parse(raw) : []
  },
  { immediate: true }
)

  const totalItems = computed(() =>
    items.value.reduce((acc, item) => acc + item.quantity, 0)
  )

  const subtotal = computed(() =>
    items.value.reduce((acc, item) => acc + item.product.price * item.quantity, 0)
  )

  const shipping = computed(() => (subtotal.value >= 299 ? 0 : 19.9))

  const total = computed(() => subtotal.value + shipping.value)

  function save() {
    if (!storageKey.value) return
    localStorage.setItem(storageKey.value, JSON.stringify(items.value))
  }

  function addItem(product: Product, quantity = 1) {
    if (!authStore.isAuthenticated) {
      throw new Error('unauthenticated')
    }

    const existing = items.value.find(i => i.product.id === product.id)

    if (existing) {
      existing.quantity += quantity
    } else {
      items.value.push({ product, quantity })
    }

    save()
  }

  function removeItem(productId: string) {
    items.value = items.value.filter(i => i.product.id !== productId)
    save()
  }

  function updateQuantity(productId: string, quantity: number) {
    if (quantity <= 0) {
      removeItem(productId)
      return
    }

    const item = items.value.find(i => i.product.id === productId)
    if (item) {
      item.quantity = quantity
      save()
    }
  }

  function clear() {
    if (!storageKey.value) return
    items.value = []
    localStorage.removeItem(storageKey.value)
  }

  return {
    items,
    totalItems,
    subtotal,
    shipping,
    total,
    addItem,
    removeItem,
    updateQuantity,
    clear,
  }
})