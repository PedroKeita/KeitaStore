<template>
  <div class="min-h-screen bg-[#0a0c10] text-white">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

      <h1 class="text-3xl font-black mb-8">Meus pedidos</h1>

      <!-- Lista vazia -->
      <div v-if="orderStore.orders.length === 0" class="flex flex-col items-center justify-center py-24 gap-4">
        <span class="text-6xl">📦</span>
        <p class="text-white/50 text-lg">Você ainda não fez nenhum pedido</p>
        <button
          @click="router.push({ name: 'home' })"
          class="px-6 py-3 bg-cyan-500 text-black font-bold rounded-xl hover:bg-cyan-400 active:scale-[0.97] transition-all duration-200"
        >
          Explorar produtos
        </button>
      </div>

      <!-- Lista de pedidos -->
      <div v-else class="flex flex-col gap-4">
        <div
          v-for="order in sortedOrders"
          :key="order.id"
          class="bg-[#111318] border border-white/5 rounded-2xl overflow-hidden"
        >
          <!-- Cabeçalho do pedido -->
          <button
            class="w-full flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 hover:bg-white/3 transition-colors text-left"
            @click="toggleOrder(order.id)"
          >
            <div class="flex flex-col sm:flex-row sm:items-center gap-4">
              <!-- Miniaturas -->
              <div class="flex -space-x-2">
                <div
                  v-for="(item, i) in order.items.slice(0, 3)"
                  :key="i"
                  class="w-10 h-10 rounded-xl overflow-hidden bg-[#0d0f14] border-2 border-[#111318] shrink-0"
                >
                  <img :src="item.product.images[0]" :alt="item.product.name" class="w-full h-full object-contain p-1" />
                </div>
                <div
                  v-if="order.items.length > 3"
                  class="w-10 h-10 rounded-xl bg-white/5 border-2 border-[#111318] flex items-center justify-center text-xs text-white/40 font-bold shrink-0"
                >
                  +{{ order.items.length - 3 }}
                </div>
              </div>

              <!-- Info -->
              <div>
                <p class="font-bold text-sm">Pedido <span class="text-cyan-400">#{{ order.id }}</span></p>
                <p class="text-xs text-white/40 mt-0.5">{{ formatDate(order.createdAt) }}</p>
              </div>
            </div>

            <div class="flex items-center gap-4 shrink-0">
              <!-- Status -->
              <span
                class="text-xs font-medium px-3 py-1 rounded-full"
                :class="{
                  'bg-green-500/20 text-green-400': order.status === 'Entregue',
                  'bg-cyan-500/20 text-cyan-400': order.status === 'Em transporte',
                  'bg-amber-500/20 text-amber-400': order.status === 'Processando',
                }"
              >
                {{ order.status }}
              </span>

              <!-- Total -->
              <p class="font-black text-sm">{{ formatPrice(order.total) }}</p>

              <!-- Chevron -->
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="w-4 h-4 text-white/20 transition-transform duration-200"
                :class="expandedOrder === order.id ? 'rotate-180' : ''"
                fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"
              >
                <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </button>

          <!-- Detalhes expandidos -->
          <Transition
            enter-active-class="transition-all duration-300"
            enter-from-class="opacity-0 -translate-y-2"
            enter-to-class="opacity-100 translate-y-0"
            leave-active-class="transition-all duration-200"
            leave-from-class="opacity-100 translate-y-0"
            leave-to-class="opacity-0 -translate-y-2"
          >
            <div v-if="expandedOrder === order.id" class="border-t border-white/5 p-5">

              <!-- Itens -->
              <p class="text-xs text-white/30 uppercase tracking-widest font-medium mb-4">Itens do pedido</p>
              <div class="flex flex-col divide-y divide-white/5 mb-6">
                <div v-for="item in order.items" :key="item.product.id" class="flex items-center gap-3 py-3">
                  <div class="w-12 h-12 shrink-0 bg-[#0d0f14] rounded-xl overflow-hidden">
                    <img :src="item.product.images[0]" :alt="item.product.name" class="w-full h-full object-contain p-1" />
                  </div>
                  <div class="flex-1 min-w-0">
                    <p class="text-sm font-medium truncate">{{ item.product.name }}</p>
                    <p class="text-xs text-white/40">Qtd: {{ item.quantity }}</p>
                  </div>
                  <p class="text-sm font-bold shrink-0">{{ formatPrice(item.product.price * item.quantity) }}</p>
                </div>
              </div>

              <!-- Endereço -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p class="text-xs text-white/30 uppercase tracking-widest font-medium mb-2">Endereço de entrega</p>
                  <p class="text-sm text-white/70">{{ order.address.street }}, {{ order.address.number }}</p>
                  <p class="text-sm text-white/70">{{ order.address.neighborhood }} — {{ order.address.city }}/{{ order.address.state }}</p>
                  <p class="text-sm text-white/70">CEP: {{ order.address.cep }}</p>
                </div>

                <!-- Totais -->
                <div>
                  <p class="text-xs text-white/30 uppercase tracking-widest font-medium mb-2">Resumo</p>
                  <div class="flex flex-col gap-1 text-sm">
                    <div class="flex justify-between text-white/50">
                      <span>Subtotal</span>
                      <span>{{ formatPrice(order.total) }}</span>
                    </div>
                    <div class="flex justify-between text-white/50">
                      <span>Frete</span>
                      <span class="text-green-400">Grátis</span>
                    </div>
                    <div class="flex justify-between font-black pt-1">
                      <span>Total</span>
                      <span>{{ formatPrice(order.total) }}</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </Transition>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useOrderStore } from '@/stores/useOrderStore'

const router = useRouter()
const orderStore = useOrderStore()

const expandedOrder = ref<string | null>(null)

const sortedOrders = computed(() =>
  [...orderStore.orders].sort((a, b) =>
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )
)

function toggleOrder(id: string) {
  expandedOrder.value = expandedOrder.value === id ? null : id
}

function formatPrice(value: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
}

function formatDate(dateStr: string) {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(dateStr))
}
</script>