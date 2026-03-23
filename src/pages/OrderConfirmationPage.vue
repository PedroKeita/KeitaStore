<template>
  <div class="min-h-screen bg-[#0a0c10] text-white">
    <div class="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

      <!-- Pedido não encontrado -->
      <div v-if="!order" class="flex flex-col items-center justify-center py-24 gap-4">
        <span class="text-5xl">😕</span>
        <p class="text-white/50">Pedido não encontrado.</p>
        <button @click="router.push({ name: 'home' })" class="px-6 py-2.5 bg-cyan-500 text-black font-bold rounded-xl text-sm">
          Voltar para a home
        </button>
      </div>

      <template v-else>

        <!-- Ícone de sucesso -->
        <div class="flex flex-col items-center text-center mb-10">
          <div class="w-20 h-20 bg-cyan-500/20 border border-cyan-500/30 rounded-full flex items-center justify-center mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-10 h-10 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 class="text-3xl font-black mb-2">Pedido confirmado!</h1>
          <p class="text-white/50">Obrigado pela sua compra. Seu pedido foi registrado com sucesso.</p>
        </div>

        <!-- Número e data do pedido -->
        <div class="bg-[#111318] border border-white/5 rounded-2xl p-4 mb-4 flex justify-between items-center">
          <div>
            <p class="text-xs text-white/30 uppercase tracking-widest font-medium mb-1">Número do pedido</p>
            <p class="font-black text-cyan-400">#{{ order.id }}</p>
          </div>
          <div class="text-right">
            <p class="text-xs text-white/30 uppercase tracking-widest font-medium mb-1">Data</p>
            <p class="text-sm text-white/70">{{ formatDate(order.createdAt) }}</p>
          </div>
        </div>

        <!-- Itens comprados -->
        <div class="bg-[#111318] border border-white/5 rounded-2xl p-4 mb-4">
          <p class="text-xs text-white/30 uppercase tracking-widest font-medium mb-4">Itens comprados</p>
          <div class="flex flex-col divide-y divide-white/5">
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

          <!-- Totais -->
          <div class="border-t border-white/5 pt-3 mt-1 flex flex-col gap-2 text-sm">
            <div class="flex justify-between text-white/50">
              <span>Subtotal</span>
              <span>{{ formatPrice(order.total) }}</span>
            </div>
            <div class="flex justify-between text-white/50">
              <span>Frete</span>
              <span class="text-green-400">Grátis</span>
            </div>
            <div class="flex justify-between font-black text-lg pt-1">
              <span>Total pago</span>
              <span>{{ formatPrice(order.total) }}</span>
            </div>
          </div>
        </div>

        <!-- Botões -->
        <div class="flex flex-col sm:flex-row gap-3 mt-8">
          <button
            @click="router.push({ name: 'home' })"
            class="flex-1 py-3.5 border border-white/10 rounded-xl text-white/60 hover:text-white hover:border-white/30 transition-all duration-200 font-medium"
          >
            Continuar comprando
          </button>
          <button
            @click="router.push({ name: 'orders' })"
            class="flex-1 py-3.5 bg-cyan-500 text-black font-bold rounded-xl hover:bg-cyan-400 active:scale-[0.97] transition-all duration-200"
          >
            Ver meus pedidos
          </button>
        </div>

      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useOrderStore } from '@/stores/useOrderStore'

const route = useRoute()
const router = useRouter()
const orderStore = useOrderStore()

const order = computed(() => orderStore.orders.find(o => o.id === route.query.id))

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