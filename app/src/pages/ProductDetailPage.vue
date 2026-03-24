<template>
  <div class="min-h-screen bg-[#0a0c10] text-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      <!-- Produto não encontrado -->
      <div v-if="!product" class="flex flex-col items-center justify-center py-24 gap-4">
        <span class="text-5xl">😕</span>
        <p class="text-white/50">Produto não encontrado.</p>
        <button @click="router.push({ name: 'products' })" class="px-6 py-2.5 bg-cyan-500 text-black font-bold rounded-xl text-sm">
          Ver todos os produtos
        </button>
      </div>

      <template v-else>

        <!-- Breadcrumb -->
        <nav class="flex items-center gap-2 text-xs text-white/30 mb-8">
          <RouterLink to="/" class="hover:text-white/60 transition-colors">Home</RouterLink>
          <span>/</span>
          <RouterLink :to="{ name: 'products', query: { category: product.category } }" class="hover:text-white/60 transition-colors capitalize">
            {{ categoryLabel }}
          </RouterLink>
          <span>/</span>
          <span class="text-white/60 truncate max-w-[200px]">{{ product.name }}</span>
        </nav>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">

          <!-- Galeria -->
          <div class="flex flex-col gap-4">
            <!-- Imagem principal -->
            <div class="relative overflow-hidden bg-[#111318] border border-white/5 rounded-3xl aspect-square">
              <Transition
                enter-active-class="transition-opacity duration-300"
                enter-from-class="opacity-0"
                enter-to-class="opacity-100"
                leave-active-class="transition-opacity duration-200"
                leave-from-class="opacity-100"
                leave-to-class="opacity-0"
                mode="out-in"
              >
                <img
                  :key="activeImage"
                  :src="activeImage"
                  :alt="product.name"
                  class="w-full h-full object-contain p-8"
                />
              </Transition>
            </div>

            <!-- Miniaturas -->
            <div class="flex gap-3">
              <button
                v-for="(img, i) in allImages"
                :key="i"
                @click="activeImage = img"
                class="w-16 h-16 rounded-xl overflow-hidden border-2 transition-all duration-200 shrink-0"
                :class="activeImage === img ? 'border-cyan-500' : 'border-white/10 hover:border-white/30'"
              >
                <img :src="img" :alt="`${product.name} ${i + 1}`" class="w-full h-full object-contain p-1" />
              </button>
            </div>
          </div>

          <!-- Informações -->
          <div class="flex flex-col gap-6">

            <!-- Nome + TTS + Wishlist -->
            <div class="flex items-start justify-between gap-4">
              <div class="flex-1">
                <span class="text-xs text-cyan-400/70 uppercase tracking-widest font-medium block mb-2">
                  {{ categoryLabel }}
                </span>
                <h1 class="text-2xl sm:text-3xl font-black leading-tight">{{ product.name }}</h1>
              </div>
              <div class="flex items-center gap-2 shrink-0 mt-1">
                <!-- TTS -->
                <button
                  v-if="speechSupported"
                  @click="toggleSpeech"
                  class="w-9 h-9 flex items-center justify-center rounded-xl border border-white/10 transition-all duration-200 hover:border-cyan-500/40 hover:text-cyan-400"
                  :class="isSpeaking ? 'text-cyan-400 border-cyan-500/40' : 'text-white/40'"
                  :aria-label="`Ouvir informações sobre ${product.name}`"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15.536 8.464a5 5 0 010 7.072M12 6.253v11.494M8.464 8.464a5 5 0 000 7.072M4.929 4.929a10 10 0 000 14.142" />
                  </svg>
                </button>
                <!-- Wishlist -->
                <button
                  @click="wishlistStore.toggle(product)"
                  class="w-9 h-9 flex items-center justify-center rounded-xl border transition-all duration-200"
                  :class="isWishlisted ? 'text-rose-400 border-rose-400/40 bg-rose-500/10' : 'text-white/40 border-white/10 hover:border-rose-400/40 hover:text-rose-400'"
                  :aria-label="`Favoritar ${product.name}`"
                >
                  <svg v-if="isWishlisted" xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                  </svg>
                  <svg v-else xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                  </svg>
                </button>
              </div>
            </div>

            <!-- Rating -->
            <div class="flex items-center gap-2">
              <div class="flex">
                <span v-for="i in 5" :key="i" class="text-base" :class="i <= Math.round(product.rating) ? 'text-amber-400' : 'text-white/15'">★</span>
              </div>
              <span class="text-sm text-white/40">{{ product.rating }} ({{ product.reviewCount }} avaliações)</span>
            </div>

            <!-- Preço -->
            <div class="flex items-end gap-3">
              <div>
                <div v-if="product.originalPrice" class="text-sm text-white/30 line-through mb-1">
                  {{ formatPrice(product.originalPrice) }}
                </div>
                <div class="text-4xl font-black">{{ formatPrice(product.price) }}</div>
              </div>
              <div v-if="product.discount" class="mb-1 px-2.5 py-1 bg-cyan-500 text-black text-sm font-bold rounded-full">
                -{{ product.discount }}%
              </div>
            </div>

            <!-- Descrição -->
            <p class="text-white/60 leading-relaxed">{{ product.description }}</p>

            <!-- Quantidade + Botão -->
            <div class="flex flex-col gap-3">
              <div class="flex items-center gap-3">
                <span class="text-sm text-white/40">Quantidade</span>
                <div class="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl p-1">
                  <button
                    @click="qty > 1 ? qty-- : null"
                    class="w-8 h-8 flex items-center justify-center rounded-lg transition-all duration-200"
                    :class="qty <= 1 ? 'text-white/20 cursor-not-allowed' : 'text-white/60 hover:bg-white/10 hover:text-white'"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M20 12H4" />
                    </svg>
                  </button>
                  <span class="w-8 text-center font-bold text-sm">{{ qty }}</span>
                  <button
                    @click="qty < 10 ? qty++ : null"
                    class="w-8 h-8 flex items-center justify-center rounded-lg transition-all duration-200"
                    :class="qty >= 10 ? 'text-white/20 cursor-not-allowed' : 'text-white/60 hover:bg-white/10 hover:text-white'"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                </div>
              </div>

              <!-- Botão adicionar ao carrinho (sticky no mobile) -->
              <div class="fixed bottom-0 left-0 right-0 p-4 bg-[#0a0c10]/95 backdrop-blur-xl border-t border-white/5 sm:relative sm:bottom-auto sm:left-auto sm:right-auto sm:p-0 sm:bg-transparent sm:border-0 z-40">
                <button
                  @click="addToCart"
                  class="w-full py-4 sm:py-3.5 bg-cyan-500 text-black font-bold rounded-xl hover:bg-cyan-400 active:scale-[0.97] transition-all duration-200 flex items-center justify-center gap-2 text-base"
                  :class="justAdded ? 'bg-green-500 hover:bg-green-400' : ''"
                >
                  <svg v-if="!justAdded" xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <svg v-else xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  {{ justAdded ? 'Adicionado ao carrinho!' : 'Adicionar ao carrinho' }}
                </button>
              </div>
            </div>

            <!-- Especificações técnicas -->
            <div class="mt-2">
              <h2 class="text-sm font-bold uppercase tracking-widest text-white/30 mb-4">Especificações técnicas</h2>
              <div class="flex flex-col divide-y divide-white/5">
                <div
                  v-for="(value, key) in product.specs"
                  :key="key"
                  class="flex justify-between py-3 text-sm"
                >
                  <span class="text-white/40">{{ key }}</span>
                  <span class="text-white font-medium text-right">{{ value }}</span>
                </div>
              </div>
            </div>

          </div>
        </div>

      </template>

      <!-- Produtos relacionados -->
        <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pb-32 sm:pb-12">
          <h2 class="text-xs font-bold uppercase tracking-[0.2em] text-white/30 mb-2">Relacionados</h2>
          <p class="text-2xl font-black mb-8">Você também pode gostar</p>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <ProductCard
            v-for="related in relatedProducts"
            :key="related.id"
            :product="related"
            />
  </div>
</section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { products } from '@/data/products'
import { useCartStore } from '@/stores/useCartStore'
import { useWishlistStore } from '@/stores/useWishlistStore'
import { useSpeech } from '@/composables/useSpeech'
import ProductCard from '@/components/ProductCard.vue'

const route = useRoute()
const router = useRouter()
const cartStore = useCartStore()
const wishlistStore = useWishlistStore()
const { speak, stop, isSpeaking, isSupported: speechSupported } = useSpeech()

const qty = ref(1)
const justAdded = ref(false)

const product = computed(() => products.find(p => p.id === route.params.id))

const categoryLabels: Record<string, string> = {
  smartphones: 'Smartphones',
  notebooks: 'Notebooks',
  audio: 'Áudio',
  perifericos: 'Periféricos',
  cameras: 'Câmeras',
  acessorios: 'Acessórios',
}

const categoryLabel = computed(() => categoryLabels[product.value?.category ?? ''] ?? '')
const isWishlisted = computed(() => wishlistStore.isFavorite(product.value?.id ?? ''))


// Garante pelo menos 2 imagens na galeria
const allImages = computed(() => {
  const imgs = product.value?.images ?? []
  if (imgs.length < 2) return [...imgs, ...imgs]
  return imgs
})

const activeImage = ref('')

watch(
  () => product.value,
  (newProduct) => {
     if (newProduct?.images?.[0]) {
      activeImage.value = newProduct.images[0]
    }
  },
  { immediate: true }
)

function formatPrice(value: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
}

function addToCart() {
  if (!product.value) return
  cartStore.addItem(product.value, qty.value)
  justAdded.value = true
  setTimeout(() => (justAdded.value = false), 2000)
}

function toggleSpeech() {
  if (isSpeaking.value) { stop(); return }
  if (!product.value) return
  const specs = Object.entries(product.value.specs).map(([k, v]) => `${k}: ${v}`).join(', ')
  const text = [
    product.value.name,
    `Categoria: ${categoryLabel.value}`,
    `Preço: ${formatPrice(product.value.price)}`,
    product.value.discount ? `Desconto de ${product.value.discount} por cento` : '',
    product.value.description,
    `Especificações: ${specs}`,
  ].filter(Boolean).join('. ')
  speak(text)
}



const relatedProducts = computed(() => {
  if (!product.value) return []

  // Produtos relacionados a mesma categoria
  const sameCategory = products.filter(
    p => p.category === product.value!.category && p.id !== product.value!.id
  )

  if( sameCategory.length >= 4) {
    return sameCategory.slice(0,8)
  }

  const featured = products.filter(
    p => p.id !== product.value!.id && p.featured && p.category !== product.value!.category
  )

  return [...sameCategory, ...featured].slice(0,8)
})

</script>