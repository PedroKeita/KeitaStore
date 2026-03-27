﻿<template>
  <div class="min-h-screen bg-[#0a0c10] text-white">

    <!-- HERO BANNER -->
    <section class="relative overflow-hidden">
      <div class="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-transparent pointer-events-none"></div>
      <div class="absolute -top-40 -right-40 w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-3xl pointer-events-none"></div>

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32 flex flex-col lg:flex-row items-center gap-12">
        <div class="flex-1 text-center lg:text-left">
          <div class="inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/20 rounded-full px-4 py-1.5 text-cyan-400 text-xs font-medium tracking-wider uppercase mb-6">
            <span class="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse"></span>
            Ofertas por tempo limitado
          </div>
          <h1 class="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight tracking-tight mb-6">
            Tech de ponta<br />
            <span class="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-cyan-600">ao melhor preço</span>
          </h1>
          <p class="text-white/50 text-lg mb-8 max-w-md mx-auto lg:mx-0">
            Smartphones, notebooks, áudio e muito mais. Descontos reais, entrega rápida.
          </p>
          <div class="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
            <button
              @click="router.push({ name: 'products' })"
              class="interactive press flex flex-col items-center gap-2 p-4 bg-[#111318] border border-white/5 rounded-2xl 
         text-white/50 
         transition-all duration-200
         hover:border-cyan-500/40 hover:bg-cyan-500/5 hover:text-cyan-400
         active:bg-cyan-500/10 active:text-cyan-300"
            >
              Ver todos os produtos
            </button>
            <button
              @click="router.push({ name: 'products', query: { category: 'smartphones' } })"
              class="interactive press flex flex-col items-center gap-2 p-4 bg-[#111318] border border-white/5 rounded-2xl 
         text-white/50 
         transition-all duration-200
         hover:border-cyan-500/40 hover:bg-cyan-500/5 hover:text-cyan-400
         active:bg-cyan-500/10 active:text-cyan-300"
            >
              Ofertas de Smartphones
            </button>
          </div>
        </div>

        <!-- Grid decorativo de produtos em destaque -->
        <div class="flex-1">
          <div class="grid grid-cols-2 gap-4 max-w-xs mx-auto">
            <div
              v-for="feat in featuredProducts.slice(0, 4)"
              :key="feat.id"
              class="hover-lift bg-white/5 border border-white/10 rounded-2xl p-4 aspect-square flex items-center justify-center hover:border-cyan-500/30 transition-colors cursor-pointer"
              @click="router.push({ name: 'product-detail', params: { id: feat.id } })"
            >
              <img :src="feat.images[0]" :alt="feat.name" class="w-full h-full object-contain" />
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CATEGORIAS -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h2 class="text-xs font-bold uppercase tracking-[0.2em] text-white/30 mb-6">Categorias</h2>
      <div class="grid grid-cols-3 sm:grid-cols-6 gap-3">
        <button
          v-for="cat in categories"
          :key="cat.id"
          @click="goToCategory(cat.slug)"
          class="interactive press flex flex-col items-center gap-2 p-4 bg-[#111318] border border-white/5 rounded-2xl hover:border-cyan-500/40 hover:bg-cyan-500/5 transition-all duration-200 group active:scale-[0.97]"
        >
          <span class="text-2xl">{{ cat.icon }}</span>
          <span class="text-xs text-white/50 group-hover:text-cyan-400 transition-colors font-medium">{{ cat.name }}</span>
        </button>
      </div>
    </section>

    <!-- DESTAQUES -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="flex items-end justify-between mb-8">
        <div>
          <h2 class="text-xs font-bold uppercase tracking-[0.2em] text-white/30 mb-2">Destaques</h2>
          <p class="text-2xl font-black">Mais populares</p>
        </div>
        <button
          @click="router.push({ name: 'products' })"
          class="press text-cyan-400 text-sm font-medium hover:text-cyan-300 transition-colors flex items-center gap-1"
        >
          Ver todos
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <!-- Skeleton -->
      <div v-if="loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <ProductCardSkeleton v-for="i in 8" :key="i" />
      </div>

      <!-- Grid de produtos -->
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <ProductCard
          v-for="product in featuredProducts"
          :key="product.id"
          :product="product"
        />
      </div>
    </section>

    <!-- TODOS OS PRODUTOS -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pb-24">
      <div class="flex items-end justify-between mb-8">
        <div>
          <h2 class="text-xs font-bold uppercase tracking-[0.2em] text-white/30 mb-2">Catálogo</h2>
          <p class="text-2xl font-black">Todos os produtos</p>
        </div>
      </div>

      <div v-if="loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <ProductCardSkeleton v-for="i in 4" :key="i" />
      </div>

      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <ProductCard
          v-for="product in nonFeaturedProducts"
          :key="product.id"
          :product="product"
        />
      </div>
    </section>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { products } from '@/data/products'
import { categories } from '@/data/categories'
import ProductCard from '@/components/ProductCard.vue'
import ProductCardSkeleton from '@/components/ProductCardSkeleton.vue'

const router = useRouter()
const loading = ref(true)

const featuredProducts = computed(() => products.filter(p => p.featured))
const nonFeaturedProducts = computed(() => products.filter(p => !p.featured))

function goToCategory(slug: string) {
  router.push({ name: 'products', query: { category: slug } })
}

onMounted(() => {
  setTimeout(() => {
    loading.value = false
  }, 800)
})
</script>