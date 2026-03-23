<template>
  <div
    class="product-card group relative flex flex-col bg-[#111318] border border-white/5 rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:border-cyan-500/40 hover:shadow-[0_0_30px_rgba(6,182,212,0.08)] hover:-translate-y-1"
    @click="goToDetail"
  >

    <!-- Badge de desconto -->
    <div
      v-if="product.discount"
      class="absolute top-3 left-3 z-10 bg-cyan-500 text-black text-xs font-bold px-2 py-1 rounded-full"
    >
      -{{ product.discount }}%
    </div>

    <!-- Botão wishlist -->
    <button
      class="absolute top-3 right-3 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-black/50 backdrop-blur-sm border border-white/10 transition-all duration-200 hover:border-rose-400/50 hover:text-rose-400"
      :class="isWishlisted ? 'text-rose-400 border-rose-400/50' : 'text-white/40'"
      @click.stop="toggleWishlist"
      :aria-label="`Favoritar ${product.name}`"
    >
      <svg v-if="isWishlisted" xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 fill-current" viewBox="0 0 24 24">
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
      </svg>
      <svg v-else xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
        <path stroke-linecap="round" stroke-linejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
      </svg>
    </button>

    <!-- Botão TTS -->
    <button
      v-if="isSupported"
      class="absolute bottom-[4.5rem] right-3 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-black/50 backdrop-blur-sm border border-white/10 transition-all duration-200 hover:border-cyan-400/50 hover:text-cyan-400"
      :class="isSpeaking ? 'text-cyan-400 border-cyan-400/50' : 'text-white/40'"
      @click.stop="toggleSpeech"
      :aria-label="`Ouvir informações sobre ${product.name}`"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
        <path stroke-linecap="round" stroke-linejoin="round" d="M15.536 8.464a5 5 0 010 7.072M12 6.253v11.494M8.464 8.464a5 5 0 000 7.072M4.929 4.929a10 10 0 000 14.142" />
      </svg>
    </button>

    <!-- Imagem -->
    <div class="relative overflow-hidden bg-[#0d0f14] aspect-square">
      <img
        :src="product.images[0]"
        :alt="product.name"
        class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        loading="lazy"
      />
    </div>

    <!-- Conteúdo -->
    <div class="flex flex-col flex-1 p-4 gap-2">

      <span class="text-xs text-cyan-400/70 uppercase tracking-widest font-medium">
        {{ categoryLabel }}
      </span>

      <h3 class="text-sm font-semibold text-white leading-snug line-clamp-2">
        {{ product.name }}
      </h3>

      <div class="flex items-center gap-1">
        <span
          v-for="i in 5"
          :key="i"
          class="text-xs"
          :class="i <= Math.round(product.rating) ? 'text-amber-400' : 'text-white/15'"
        >★</span>
        <span class="text-xs text-white/40 ml-1">({{ product.reviewCount }})</span>
      </div>

      <div class="mt-auto pt-2">
        <div v-if="product.originalPrice" class="text-xs text-white/30 line-through">
          {{ formatPrice(product.originalPrice) }}
        </div>
        <div class="text-lg font-bold text-white">
          {{ formatPrice(product.price) }}
        </div>
      </div>

      <button
        class="w-full mt-2 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 active:scale-[0.97] flex items-center justify-center gap-2"
        :class="justAdded
          ? 'bg-green-500/20 text-green-400 border border-green-500/30'
          : 'bg-cyan-500 text-black hover:bg-cyan-400'"
        @click.stop="addToCart"
      >
        <svg v-if="!justAdded" xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        <svg v-else xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
        </svg>
        {{ justAdded ? 'Adicionado!' : 'Adicionar ao carrinho' }}
      </button>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import type { Product } from '@/types'
import { useCartStore } from '@/stores/useCartStore'
import { useWishlistStore } from '@/stores/useWishlistStore'
import { useSpeech } from '@/composables/useSpeech'

const props = defineProps<{ product: Product }>()

const router = useRouter()
const cartStore = useCartStore()
const wishlistStore = useWishlistStore()
const { speak, stop, isSpeaking, isSupported } = useSpeech()

const justAdded = ref(false)

const categoryLabels: Record<string, string> = {
  smartphones: 'Smartphones',
  notebooks: 'Notebooks',
  audio: 'Áudio',
  perifericos: 'Periféricos',
  cameras: 'Câmeras',
  acessorios: 'Acessórios',
}

const categoryLabel = computed(() => categoryLabels[props.product.category] ?? props.product.category)
const isWishlisted = computed(() => wishlistStore.isFavorite(props.product.id))

function formatPrice(value: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
}

function goToDetail() {
  router.push({ name: 'product-detail', params: { id: props.product.id } })
}

function addToCart() {
  cartStore.addItem(props.product, 1)
  justAdded.value = true
  setTimeout(() => (justAdded.value = false), 2000)
}

function toggleWishlist() {
  wishlistStore.toggle(props.product)
}

function toggleSpeech() {
  if (isSpeaking.value) {
    stop()
    return
  }
  const text = [
    props.product.name,
    `Categoria: ${categoryLabel.value}`,
    `Preço: ${formatPrice(props.product.price)}`,
    props.product.discount ? `Desconto de ${props.product.discount} por cento` : '',
  ].filter(Boolean).join('. ')

  speak(text)
}
</script>