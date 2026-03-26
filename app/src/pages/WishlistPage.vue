<template>
  <div class="min-h-screen bg-[#0a0c10] text-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

      <!-- Header -->
      <div class="flex items-end justify-between mb-8">
        <div>
          <h1 class="text-3xl font-black">
            Meus favoritos
            <span class="text-cyan-400">({{ wishlistStore.totalItems }})</span>
          </h1>
          <p class="text-white/40 text-sm mt-1">
            Produtos que você salvou para ver depois
          </p>
        </div>

        <!-- Botão limpar tudo (só aparece se tiver itens) -->
        <button
          v-if="wishlistStore.totalItems > 0"
          @click="confirmClearAll"
          class="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl border border-white/10 text-white/40 hover:text-rose-400 hover:border-rose-500/30 transition-all duration-200 text-sm"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          Limpar tudo
        </button>
      </div>

      <!-- Estado vazio -->
      <div
        v-if="wishlistStore.totalItems === 0"
        class="flex flex-col items-center justify-center py-32 gap-6"
      >
        <!-- Ícone ilustrativo animado -->
        <div class="relative">
          <div class="w-24 h-24 bg-rose-500/10 border border-rose-500/20 rounded-3xl flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="w-12 h-12 text-rose-400/60"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="1"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          </div>
          <!-- Pontinhos decorativos -->
          <div class="absolute -top-1 -right-1 w-3 h-3 bg-rose-500/30 rounded-full"></div>
          <div class="absolute -bottom-2 -left-2 w-2 h-2 bg-cyan-500/30 rounded-full"></div>
        </div>

        <div class="text-center">
          <p class="text-xl font-bold text-white/70 mb-2">Nenhum favorito ainda</p>
          <p class="text-white/30 text-sm max-w-xs mx-auto leading-relaxed">
            Toque no ❤️ em qualquer produto para salvar aqui e revisitar quando quiser.
          </p>
        </div>

        <button
          @click="router.push({ name: 'products' })"
          class="flex items-center gap-2 px-8 py-3.5 bg-cyan-500 text-black font-bold rounded-xl hover:bg-cyan-400 active:scale-[0.97] transition-all duration-200"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
          Explorar produtos
        </button>
      </div>

      <!-- Grid de favoritos -->
      <div v-else>
        <!-- Botão limpar mobile -->
        <div class="sm:hidden mb-4 flex justify-end">
          <button
            @click="confirmClearAll"
            class="flex items-center gap-1.5 text-xs text-white/30 hover:text-rose-400 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Limpar tudo
          </button>
        </div>

        <TransitionGroup
          tag="div"
          class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
          enter-active-class="transition-all duration-300"
          enter-from-class="opacity-0 scale-95 -translate-y-2"
          enter-to-class="opacity-100 scale-100 translate-y-0"
          leave-active-class="transition-all duration-200 absolute"
          leave-from-class="opacity-100 scale-100"
          leave-to-class="opacity-0 scale-90"
        >
          <WishlistCard
            v-for="product in wishlistStore.items"
            :key="product.id"
            :product="product"
            @remove="wishlistStore.toggle(product)"
            @add-to-cart="handleAddToCart(product)"
          />
        </TransitionGroup>

        <!-- Rodapé: total e ir para carrinho -->
        <div class="mt-10 flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#111318] border border-white/5 rounded-2xl p-5">
          <p class="text-sm text-white/50">
            <span class="font-bold text-white">{{ wishlistStore.totalItems }}</span> produto{{ wishlistStore.totalItems !== 1 ? 's' : '' }} salvo{{ wishlistStore.totalItems !== 1 ? 's' : '' }}
          </p>
          <div class="flex items-center gap-3">
            <button
              @click="addAllToCart"
              class="flex items-center gap-2 px-5 py-2.5 border border-cyan-500/40 text-cyan-400 rounded-xl hover:bg-cyan-500/10 transition-all duration-200 text-sm font-medium"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Adicionar tudo ao carrinho
            </button>
            <button
              @click="router.push({ name: 'cart' })"
              class="px-5 py-2.5 bg-cyan-500 text-black font-bold rounded-xl hover:bg-cyan-400 active:scale-[0.97] transition-all duration-200 text-sm"
            >
              Ver carrinho →
            </button>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { defineComponent, h } from 'vue'
import { useRouter } from 'vue-router'
import { useWishlistStore } from '@/stores/useWishlistStore'
import { useCartStore } from '@/stores/useCartStore'
import type { Product } from '@/types'

const router = useRouter()
const wishlistStore = useWishlistStore()
const cartStore = useCartStore()

function handleAddToCart(product: Product) {
  cartStore.addItem(product, 1)
}

function addAllToCart() {
  wishlistStore.items.forEach((product) => {
    cartStore.addItem(product, 1)
  })
}

function confirmClearAll() {
  if (confirm('Remover todos os favoritos?')) {
    wishlistStore.clear()
  }
}

// ─── WishlistCard inline component ───────────────────────────────────────────
const categoryLabels: Record<string, string> = {
  smartphones: 'Smartphones',
  notebooks: 'Notebooks',
  audio: 'Áudio',
  perifericos: 'Periféricos',
  cameras: 'Câmeras',
  acessorios: 'Acessórios',
}

const WishlistCard = defineComponent({
  name: 'WishlistCard',
  props: {
    product: { type: Object as () => Product, required: true },
  },
  emits: ['remove', 'add-to-cart'],
  setup(props, { emit }) {
    const router = useRouter()

    function formatPrice(value: number) {
      return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
    }

    return () =>
      h(
        'div',
        {
          class:
            'group relative flex flex-col bg-[#111318] border border-white/5 rounded-2xl overflow-hidden transition-all duration-300 hover:border-cyan-500/40 hover:shadow-[0_0_30px_rgba(6,182,212,0.08)] hover:-translate-y-1',
        },
        [
          // Badge desconto
          props.product.discount
            ? h(
                'div',
                {
                  class:
                    'absolute top-3 left-3 z-10 bg-cyan-500 text-black text-xs font-bold px-2 py-1 rounded-full',
                },
                `-${props.product.discount}%`
              )
            : null,

          // Botão remover favorito
          h(
            'button',
            {
              class:
                'absolute top-3 right-3 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-black/50 backdrop-blur-sm border border-rose-400/50 text-rose-400 transition-all duration-200 hover:bg-rose-500/20',
              onClick: (e: Event) => {
                e.stopPropagation()
                emit('remove')
              },
              'aria-label': `Remover ${props.product.name} dos favoritos`,
            },
            [
              h(
                'svg',
                {
                  xmlns: 'http://www.w3.org/2000/svg',
                  class: 'w-4 h-4 fill-current',
                  viewBox: '0 0 24 24',
                },
                [
                  h('path', {
                    d: 'M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z',
                  }),
                ]
              ),
            ]
          ),

          // Imagem clicável
          h(
            'div',
            {
              class:
                'relative overflow-hidden bg-[#0d0f14] aspect-square cursor-pointer',
              onClick: () =>
                router.push({ name: 'product-detail', params: { id: props.product.id } }),
            },
            [
              h('img', {
                src: props.product.images[0],
                alt: props.product.name,
                class:
                  'w-full h-full object-cover transition-transform duration-500 group-hover:scale-105',
                loading: 'lazy',
              }),
            ]
          ),

          // Conteúdo
          h('div', { class: 'flex flex-col flex-1 p-4 gap-2' }, [
            // Categoria
            h(
              'span',
              { class: 'text-xs text-cyan-400/70 uppercase tracking-widest font-medium' },
              categoryLabels[props.product.category] ?? props.product.category
            ),

            // Nome (clicável)
            h(
              'h3',
              {
                class:
                  'text-sm font-semibold text-white leading-snug line-clamp-2 cursor-pointer hover:text-cyan-300 transition-colors',
                onClick: () =>
                  router.push({ name: 'product-detail', params: { id: props.product.id } }),
              },
              props.product.name
            ),

            // Rating
            h('div', { class: 'flex items-center gap-1' }, [
              ...[1, 2, 3, 4, 5].map((i) =>
                h(
                  'span',
                  {
                    class: `text-xs ${i <= Math.round(props.product.rating) ? 'text-amber-400' : 'text-white/15'}`,
                  },
                  '★'
                )
              ),
              h(
                'span',
                { class: 'text-xs text-white/40 ml-1' },
                `(${props.product.reviewCount})`
              ),
            ]),

            // Preço
            h('div', { class: 'mt-auto pt-2' }, [
              props.product.originalPrice
                ? h(
                    'div',
                    { class: 'text-xs text-white/30 line-through' },
                    formatPrice(props.product.originalPrice)
                  )
                : null,
              h('div', { class: 'text-lg font-bold text-white' }, formatPrice(props.product.price)),
            ]),

            // Botão adicionar ao carrinho
            h(
              'button',
              {
                class:
                  'w-full mt-2 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 active:scale-[0.97] flex items-center justify-center gap-2 bg-cyan-500 text-black hover:bg-cyan-400',
                onClick: (e: Event) => {
                  e.stopPropagation()
                  emit('add-to-cart')
                },
              },
              [
                h(
                  'svg',
                  {
                    xmlns: 'http://www.w3.org/2000/svg',
                    class: 'w-4 h-4',
                    fill: 'none',
                    viewBox: '0 0 24 24',
                    stroke: 'currentColor',
                    'stroke-width': '2',
                  },
                  [
                    h('path', {
                      'stroke-linecap': 'round',
                      'stroke-linejoin': 'round',
                      d: 'M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z',
                    }),
                  ]
                ),
                'Adicionar ao carrinho',
              ]
            ),
          ]),
        ]
      )
  },
})
</script>
