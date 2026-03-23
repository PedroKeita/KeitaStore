import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { CartItem, Product } from '@/types'
import { useToast } from '@/composables/useToast'


export const useCartStore = defineStore('cart', () => {
  const items = ref<CartItem[]>([])

  const { show } = useToast()
  

  const totalItems = computed(() =>
    items.value.reduce((acc, item) => acc + item.quantity, 0)
  )

  const subtotal = computed(() =>
    items.value.reduce((acc, item) => acc + item.product.price * item.quantity, 0)
  )

  const shipping = computed(() => (subtotal.value >= 299 ? 0 : 19.9))

  const total = computed(() => subtotal.value + shipping.value)

  function addItem(product: Product, quantity = 1) {
    const existing = items.value.find(i => i.product.id === product.id)
    if (existing) {
      existing.quantity += quantity
    } else {
      items.value.push({ product, quantity })
    }
    show(`"${product.name}" adicionado ao carrinho`)
}

  function removeItem(productId: string) {
    items.value = items.value.filter(i => i.product.id !== productId)
  }

  function updateQuantity(productId: string, quantity: number) {
    const item = items.value.find(i => i.product.id === productId)
    if (item) {
      if (quantity <= 0) removeItem(productId)
      else item.quantity = quantity
    }
  }

  function clear() {
    items.value = []
  }

  return { items, totalItems, subtotal, shipping, total, addItem, removeItem, updateQuantity, clear }
})