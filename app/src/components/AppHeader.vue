<template>
  <header class="sticky top-0 z-50 bg-[#0a0c10]/90 backdrop-blur-xl border-b border-white/5">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center h-16 gap-3">

        <!-- Logo -->
        <RouterLink to="/" class="flex items-center gap-2 shrink-0">
          <div class="w-7 h-7 bg-cyan-500 rounded-lg flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <span class="font-black text-lg tracking-tight hidden sm:block text-white">Keita<span class="text-cyan-400">Store</span></span>
        </RouterLink>

        <!-- Search bar desktop -->
        <div class="flex-1 max-w-xl hidden sm:block">
          <div class="relative">
            <svg xmlns="http://www.w3.org/2000/svg" class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              v-model="searchInput"
              type="text"
              placeholder="Buscar produtos..."
              class="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-10 py-2.5 text-sm text-white placeholder-white/25 focus:outline-none focus:border-cyan-500/50 transition-all duration-200"
              @keyup.enter="doSearch"
            />
            <button
              v-if="searchInput"
              @click="clearSearch"
              class="press absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex items-center gap-1 sm:gap-2 ml-auto shrink-0">

          <!-- Search icon mobile -->
          <button
            class="press sm:hidden w-9 h-9 flex items-center justify-center rounded-xl border border-white/10 text-white/40 hover:text-white transition-colors"
            @click="mobileSearchOpen = !mobileSearchOpen"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>

          <!-- Wishlist -->
          <RouterLink
            to="/favoritos"
            class="interactive press relative w-9 h-9 flex items-center justify-center rounded-xl border border-white/10 text-white/40 hover:text-rose-400 hover:border-rose-400/30 transition-all duration-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <span v-if="wishlistCount > 0" 
              :class="['absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center', { bump: wishlistCount }]">
           
              {{ wishlistCount }}
            </span>
          </RouterLink>

          <!-- Cart -->
          <RouterLink
            to="/carrinho"
            class="interative press relative w-9 h-9 flex items-center justify-center rounded-xl border border-white/10 text-white/40 hover:text-cyan-400 hover:border-cyan-500/30 transition-all duration-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span v-if="cartCount > 0" 
              :class="['absolute -top-1 -right-1 w-4 h-4 bg-cyan-500 text-black text-[10px] font-bold rounded-full flex items-center justify-center',{ bump: cartCount }]">
              {{ cartCount }}
            </span>
          </RouterLink>

          <!-- Auth -->
          <div v-if="authStore.isAuthenticated" class="relative">
            <button
              @click="showUserMenu = !showUserMenu"
              class="press w-9 h-9 rounded-xl overflow-hidden border border-white/10 hover:border-cyan-500/30 transition-all duration-200"
            >
              <img v-if="authStore.user?.avatar" :src="authStore.user.avatar" :alt="authStore.user.name" class="w-full h-full object-cover" />
              <div v-else class="w-full h-full bg-cyan-500 flex items-center justify-center text-black font-bold text-sm">
                {{ authStore.user?.name?.[0] ?? 'U' }}
              </div>
            </button>

            <!-- Dropdown -->
            <div v-if="showUserMenu" class="absolute right-0 top-11 w-48 bg-[#111318] border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50">
              <div class="px-4 py-3 border-b border-white/5">
                <p class="text-sm font-semibold text-white truncate">{{ authStore.user?.name }}</p>
                <p class="text-xs text-white/40 truncate">{{ authStore.user?.email }}</p>
              </div>
              <RouterLink to="/perfil" @click="showUserMenu = false" class="block px-4 py-2.5 text-sm text-white/60 hover:text-white hover:bg-white/5 transition-colors">Meu perfil</RouterLink>
              <RouterLink to="/meus-pedidos" @click="showUserMenu = false" class="block px-4 py-2.5 text-sm text-white/60 hover:text-white hover:bg-white/5 transition-colors">Meus pedidos</RouterLink>
              <button @click="logout" class="press w-full text-left px-4 py-2.5 text-sm text-rose-400 hover:bg-rose-500/10 transition-colors border-t border-white/5">Sair</button>
            </div>
          </div>

          <RouterLink
            v-else
            to="/login"
            class="hidden sm:flex items-center px-4 py-2 bg-cyan-500 text-black text-sm font-bold rounded-xl hover:bg-cyan-400 active:scale-[0.97] transition-all duration-200"
          >
            Entrar
          </RouterLink>

        </div>
      </div>

      <!-- Search bar mobile expansível -->
      <Transition
        enter-active-class="transition-all duration-200"
        enter-from-class="opacity-0 -translate-y-2"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition-all duration-200"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 -translate-y-2"
      >
        <div v-if="mobileSearchOpen" class="sm:hidden pb-3">
          <div class="relative">
            <svg xmlns="http://www.w3.org/2000/svg" class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              v-model="searchInput"
              type="text"
              placeholder="Buscar produtos..."
              class="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-10 py-2.5 text-sm text-white placeholder-white/25 focus:outline-none focus:border-cyan-500/50 transition-all duration-200"
              @keyup.enter="doSearch"
              autofocus
            />
            <button
              v-if="searchInput"
              @click="clearSearch"
              class="press absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </Transition>

    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useCartStore } from '@/stores/useCartStore'
import { useWishlistStore } from '@/stores/useWishlistStore'
import { useAuthStore } from '@/stores/useAuthStore'

const router = useRouter()
const route = useRoute()
const cartStore = useCartStore()
const wishlistStore = useWishlistStore()
const authStore = useAuthStore()

const searchInput = ref('')
const showUserMenu = ref(false)
const mobileSearchOpen = ref(false)

const cartCount = computed(() => cartStore.totalItems)
const wishlistCount = computed(() => wishlistStore.totalItems)

// Debounce de 300ms
let debounceTimer: ReturnType<typeof setTimeout>
watch(searchInput, (val) => {
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    if (val.trim()) {
      router.push({ name: 'products', query: { ...route.query, q: val.trim() } })
    } else if (route.query.q) {
      const query = { ...route.query }
      delete query.q
      router.push({ name: 'products', query })
    }
  }, 300)
})

function doSearch() {
  clearTimeout(debounceTimer)
  if (searchInput.value.trim()) {
    router.push({ name: 'products', query: { ...route.query, q: searchInput.value.trim() } })
  }
  mobileSearchOpen.value = false
}

function clearSearch() {
  searchInput.value = ''
  const query = { ...route.query }
  delete query.q
  router.push({ name: 'products', query })
}

function logout() {
  authStore.logout()
  showUserMenu.value = false
  router.push({ name: 'home' })
}
</script>




