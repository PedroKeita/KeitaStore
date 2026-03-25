
<template>
  <div class="min-h-screen bg-[#0a0c10] text-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

      <!-- Cabeçalho -->
      <div class="mb-8">
        <h1 class="text-3xl font-black mb-1">Produtos</h1>
        <p class="text-white/40 text-sm">{{ resultLabel }}</p>
      </div>

      <!-- Filtros desktop: chips horizontais -->
      <div class="hidden sm:flex items-center gap-2 flex-wrap mb-8">
        <button
          v-for="cat in allCategories"
          :key="cat.slug"
          @click="selectCategory(cat.slug)"
          class="category-pill press flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium border"
  :class="activeCategory === cat.slug
    ? 'active'
    : 'inactive'"
        >
          <span>{{ cat.icon }}</span>
          <span>{{ cat.name }}</span>
        </button>
      </div>

      <!-- Filtros mobile: botão que abre drawer -->
      <div class="sm:hidden mb-6 flex items-center gap-3">
        <button
          @click="drawerOpen = true"
          class="flex items-center gap-2 px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white/60 hover:border-cyan-500/40 transition-all duration-200"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z" />
          </svg>
          Filtrar
          <span v-if="activeCategory !== 'todos'" class="w-2 h-2 bg-cyan-400 rounded-full"></span>
        </button>

        <!-- Chip da categoria ativa no mobile -->
        <div
          v-if="activeCategory !== 'todos'"
          class="flex items-center gap-2 px-3 py-1.5 bg-cyan-500/10 border border-cyan-500/30 rounded-full text-xs text-cyan-400"
        >
          {{ activeCategoryLabel }}
          <button @click="selectCategory('todos')" class="hover:text-white transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Grid de produtos -->
      <div v-if="filteredProducts.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <ProductCard
          v-for="product in filteredProducts"
          :key="product.id"
          :product="product"
        />
      </div>

      <!-- Estado vazio -->
      <div v-else class="flex flex-col items-center justify-center py-24 gap-4">
        <span class="text-5xl">🔍</span>
        <p class="text-white/50 text-center">
          Nenhum produto encontrado
          <span v-if="searchQuery"> para "<span class="text-white">{{ searchQuery }}</span>"</span>
          <span v-if="activeCategory !== 'todos'"> em <span class="text-white">{{ activeCategoryLabel }}</span></span>
        </p>
        <button
          @click="clearFilters"
          class="px-6 py-2.5 bg-cyan-500 text-black font-bold rounded-xl hover:bg-cyan-400 transition-all duration-200 text-sm"
        >
          Limpar filtros
        </button>
      </div>

    </div>

    <!-- Drawer mobile -->
    <Teleport to="body">
      <Transition
        enter-active-class="transition-opacity duration-300"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition-opacity duration-300"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div
          v-if="drawerOpen"
          class="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          @click="drawerOpen = false"
        ></div>
      </Transition>

      <Transition
        enter-active-class="transition-transform duration-300"
        enter-from-class="translate-y-full"
        enter-to-class="translate-y-0"
        leave-active-class="transition-transform duration-300"
        leave-from-class="translate-y-0"
        leave-to-class="translate-y-full"
      >
        <div
          v-if="drawerOpen"
          class="fixed bottom-0 left-0 right-0 bg-[#111318] border-t border-white/10 rounded-t-3xl p-6 z-50"
        >
          <div class="w-10 h-1 bg-white/20 rounded-full mx-auto mb-6"></div>
          <h3 class="text-lg font-bold mb-4">Filtrar por categoria</h3>
          <div class="flex flex-col gap-2">
            <button
              v-for="cat in allCategories"
              :key="cat.slug"
              @click="selectCategory(cat.slug); drawerOpen = false"
              class="flex items-center gap-3 px-4 py-3 rounded-xl border transition-all duration-200 text-left"
              :class="activeCategory === cat.slug
                ? 'bg-cyan-500/10 border-cyan-500/40 text-cyan-400'
                : 'bg-white/5 border-white/5 text-white/60 hover:border-white/20'"
            >
              <span class="text-xl">{{ cat.icon }}</span>
              <span class="font-medium">{{ cat.name }}</span>
              <svg v-if="activeCategory === cat.slug" xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 ml-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </button>
          </div>
        </div>
      </Transition>
    </Teleport>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { products } from '@/data/products'
import { categories } from '@/data/categories'
import type { Category } from '@/types'
import ProductCard from '@/components/ProductCard.vue'

const route = useRoute()
const router = useRouter()

const drawerOpen = ref(false)
const activeCategory = ref('todos')
const searchQuery = ref('')

// Adiciona opção "Todos" no início
const allCategories = computed<Category[]>(() => [
  { id: '0', name: 'Todos', icon: '🛍️', slug: 'todos' },
  ...categories,
])

const activeCategoryLabel = computed(() => {
  const found = allCategories.value.find(c => c.slug === activeCategory.value)
  return found?.name ?? ''
})

const filteredProducts = computed(() => {
  let result = products

  // Filtro por categoria
  if (activeCategory.value !== 'todos') {
    result = result.filter(p => p.category === activeCategory.value)
  }

  // Filtro por busca
  if (searchQuery.value.trim()) {
    const term = normalize(searchQuery.value)
    result = result.filter(p =>
      normalize(p.name).includes(term) ||
      normalize(p.description).includes(term)
    )
  }

  return result
})

const resultLabel = computed(() => {
  const count = filteredProducts.value.length
  return `${count} produto${count !== 1 ? 's' : ''} encontrado${count !== 1 ? 's' : ''}`
})

// Remove acentos e deixa minúsculo para comparação
function normalize(str: string) {
  return str.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
}

function selectCategory(slug: string) {
  activeCategory.value = slug
  // Reflete na URL
  router.replace({
    query: {
      ...route.query,
      category: slug === 'todos' ? undefined : slug,
    },
  })
}

function clearFilters() {
  activeCategory.value = 'todos'
  searchQuery.value = ''
  router.replace({ query: {} })
}

// Lê query params ao montar (ex: vindo da home ou busca)
onMounted(() => {
  if (route.query.category) {
    activeCategory.value = route.query.category as string
  }
  if (route.query.q) {
    searchQuery.value = route.query.q as string
  }
})

// Atualiza se a URL mudar (ex: busca no header)
watch(() => route.query, (query) => {
  if (query.category) activeCategory.value = query.category as string
  else activeCategory.value = 'todos'

  if (query.q) searchQuery.value = query.q as string
  else searchQuery.value = ''
})
</script>
```
