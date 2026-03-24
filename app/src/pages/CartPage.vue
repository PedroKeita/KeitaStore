<template>
  <div class="min-h-screen bg-[#0a0c10] text-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

      <h1 class="text-3xl font-black mb-8">Carrinho</h1>

      <!-- Carrinho vazio -->
      <div v-if="cartStore.items.length === 0" class="flex flex-col items-center justify-center py-24 gap-4">
        <span class="text-6xl">🛒</span>
        <p class="text-white/50 text-lg">Seu carrinho está vazio</p>
        <button
          @click="router.push({ name: 'products' })"
          class="px-6 py-3 bg-cyan-500 text-black font-bold rounded-xl hover:bg-cyan-400 active:scale-[0.97] transition-all duration-200"
        >
          Continuar comprando
        </button>
      </div>

      <!-- Itens + Resumo -->
      <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-8">

        <!-- Lista de itens -->
        <div class="lg:col-span-2 flex flex-col gap-4">
          <TransitionGroup
            enter-active-class="transition-all duration-300"
            enter-from-class="opacity-0 -translate-x-4"
            enter-to-class="opacity-100 translate-x-0"
            leave-active-class="transition-all duration-200"
            leave-from-class="opacity-100 scale-100"
            leave-to-class="opacity-0 scale-95"
          >
            <div
              v-for="item in cartStore.items"
              :key="item.product.id"
              class="flex gap-4 bg-[#111318] border border-white/5 rounded-2xl p-4"
            >
              <!-- Imagem -->
              <div class="w-20 h-20 shrink-0 bg-[#0d0f14] rounded-xl overflow-hidden">
                <img :src="item.product.images[0]" :alt="item.product.name" class="w-full h-full object-contain p-2" />
              </div>

              <!-- Info -->
              <div class="flex-1 min-w-0">
                <p class="text-xs text-cyan-400/70 uppercase tracking-widest font-medium mb-1">
                  {{ categoryLabels[item.product.category] }}
                </p>
                <p class="font-semibold text-sm leading-snug truncate">{{ item.product.name }}</p>
                <p class="text-lg font-black mt-1">{{ formatPrice(item.product.price) }}</p>
              </div>

              <!-- Quantidade + Remover -->
              <div class="flex flex-col items-end justify-between shrink-0">
                <!-- Botão remover -->
                <button
                  @click="cartStore.removeItem(item.product.id)"
                  class="text-white/20 hover:text-rose-400 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>

                <!-- Seletor de quantidade -->
                <div class="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl p-1">
                  <button
                    @click="decrement(item)"
                    class="w-7 h-7 flex items-center justify-center rounded-lg transition-all duration-200"
                    :class="item.quantity <= 1 ? 'text-white/20' : 'text-white/60 hover:bg-white/10 hover:text-white'"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M20 12H4" />
                    </svg>
                  </button>
                  <span class="w-6 text-center text-sm font-bold">{{ item.quantity }}</span>
                  <button
                    @click="cartStore.updateQuantity(item.product.id, item.quantity + 1)"
                    class="w-7 h-7 flex items-center justify-center rounded-lg text-white/60 hover:bg-white/10 hover:text-white transition-all duration-200"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </TransitionGroup>
        </div>

        <!-- Resumo do pedido -->
        <div class="lg:col-span-1">
          <div class="bg-[#111318] border border-white/5 rounded-2xl p-6 sticky top-24">
            <h2 class="font-bold text-lg mb-6">Resumo do pedido</h2>

            <div class="flex flex-col gap-3 text-sm">
              <div class="flex justify-between text-white/60">
                <span>Subtotal ({{ cartStore.totalItems }} itens)</span>
                <span>{{ formatPrice(cartStore.subtotal) }}</span>
              </div>
              <div class="flex justify-between text-white/60">
                <span>Frete</span>
                <span :class="cartStore.shipping === 0 ? 'text-green-400 font-medium' : ''">
                  {{ cartStore.shipping === 0 ? 'Grátis' : formatPrice(cartStore.shipping) }}
                </span>
              </div>

              <!-- Barra de progresso frete grátis -->
              <div v-if="cartStore.shipping > 0" class="mt-1">
                <div class="flex justify-between text-xs text-white/30 mb-1.5">
                  <span>Faltam {{ formatPrice(299 - cartStore.subtotal) }} para frete grátis</span>
                </div>
                <div class="w-full bg-white/5 rounded-full h-1.5">
                  <div
                    class="bg-cyan-500 h-1.5 rounded-full transition-all duration-300"
                    :style="{ width: `${Math.min((cartStore.subtotal / 299) * 100, 100)}%` }"
                  ></div>
                </div>
              </div>

              <div class="border-t border-white/5 pt-3 mt-1 flex justify-between font-black text-lg">
                <span>Total</span>
                <span>{{ formatPrice(cartStore.total) }}</span>
              </div>
            </div>

            <button
              @click="router.push({ name: 'checkout' })"
              class="w-full mt-6 py-3.5 bg-cyan-500 text-black font-bold rounded-xl hover:bg-cyan-400 active:scale-[0.97] transition-all duration-200"
            >
              Finalizar compra
            </button>

            <button
              @click="router.push({ name: 'products' })"
              class="w-full mt-3 py-3 text-white/40 hover:text-white/70 transition-colors text-sm"
            >
              Continuar comprando
            </button>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useCartStore } from '@/stores/useCartStore'
import type { CartItem } from '@/types'

const router = useRouter()
const cartStore = useCartStore()

const categoryLabels: Record<string, string> = {
  smartphones: 'Smartphones',
  notebooks: 'Notebooks',
  audio: 'Áudio',
  perifericos: 'Periféricos',
  cameras: 'Câmeras',
  acessorios: 'Acessórios',
}

function formatPrice(value: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
}

function decrement(item: CartItem) {
  if (item.quantity <= 1) {
    if (confirm('Deseja remover este item do carrinho?')) {
      cartStore.removeItem(item.product.id)
    }
  } else {
    cartStore.updateQuantity(item.product.id, item.quantity - 1)
  }
}
</script>