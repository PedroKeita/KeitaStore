import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Order, CartItem, Address } from '@/types'

export const useOrderStore = defineStore('orders', () => {
  const orders = ref<Order[]>([])

  function addOrder(items: CartItem[], total: number, address: Address): Order {
    const order: Order = {
      id: `2024-${String(orders.value.length + 1).padStart(4, '0')}`,
      items,
      total,
      status: 'Processando',
      createdAt: new Date().toISOString(),
      address,
    }
    orders.value.unshift(order)
    return order
  }

  return { orders, addOrder }
})