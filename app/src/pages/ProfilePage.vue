<template>
  <div class="min-h-screen bg-[#0a0c10] text-white">
    <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

      <h1 class="text-3xl font-black mb-8">Meu perfil</h1>

      <!-- Card principal -->
      <div class="bg-[#111318] border border-white/5 rounded-3xl p-8 mb-6">

        <!-- Avatar + info -->
        <div class="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-8">
          <div class="relative shrink-0">
            <div class="w-20 h-20 rounded-2xl overflow-hidden bg-cyan-500 flex items-center justify-center">
              <img
                v-if="authStore.user?.avatar"
                :src="authStore.user.avatar"
                :alt="authStore.user.name"
                class="w-full h-full object-cover"
              />
              <span v-else class="text-black text-3xl font-black">
                {{ authStore.user?.name?.[0] ?? 'U' }}
              </span>
            </div>
          </div>

          <div class="flex-1 text-center sm:text-left">
            <p class="text-xs text-cyan-400/70 uppercase tracking-widest font-medium mb-1">Conta</p>
            <h2 class="text-2xl font-black">{{ authStore.user?.name }}</h2>
            <p class="text-white/40 text-sm mt-1">{{ authStore.user?.email }}</p>
          </div>
        </div>

        <!-- Editar nome -->
        <div class="border-t border-white/5 pt-6">
          <p class="text-xs text-white/30 uppercase tracking-widest font-medium mb-4">Editar nome</p>
          <div class="flex gap-3">
            <input
              v-model="newName"
              type="text"
              placeholder="Seu nome"
              class="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/25 focus:outline-none focus:border-cyan-500/50 transition-all duration-200"
              :class="{ 'border-rose-500/50': nameError }"
              @keyup.enter="saveName"
            />
            <button
              @click="saveName"
              :disabled="saving"
              class="px-6 py-2.5 bg-cyan-500 text-black font-bold rounded-xl hover:bg-cyan-400 active:scale-[0.97] transition-all duration-200 text-sm disabled:opacity-50"
            >
              {{ saving ? 'Salvando...' : 'Salvar' }}
            </button>
          </div>
          <p v-if="nameError" class="text-xs text-rose-400 mt-1">{{ nameError }}</p>
          <p v-if="nameSaved" class="text-xs text-green-400 mt-1">Nome atualizado com sucesso!</p>
        </div>

      </div>

      <!-- Resumo -->
      <div class="grid grid-cols-2 gap-4 mb-6">
        <div class="bg-[#111318] border border-white/5 rounded-2xl p-6 flex flex-col gap-1">
          <p class="text-3xl font-black text-cyan-400">{{ orderStore.orders.length }}</p>
          <p class="text-sm text-white/40">Pedidos realizados</p>
        </div>
        <div class="bg-[#111318] border border-white/5 rounded-2xl p-6 flex flex-col gap-1">
          <p class="text-3xl font-black text-rose-400">{{ wishlistStore.totalItems }}</p>
          <p class="text-sm text-white/40">Itens favoritados</p>
        </div>
      </div>

      <!-- Links rápidos -->
      <div class="flex flex-col gap-3">
        <button
          @click="router.push({ name: 'orders' })"
          class="flex items-center justify-between bg-[#111318] border border-white/5 rounded-2xl px-6 py-4 hover:border-cyan-500/30 transition-all duration-200 group"
        >
          <div class="flex items-center gap-3">
            <div class="w-9 h-9 bg-cyan-500/10 rounded-xl flex items-center justify-center text-cyan-400">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <span class="font-medium text-sm">Meus pedidos</span>
          </div>
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-white/20 group-hover:text-cyan-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>

        <button
          @click="router.push({ name: 'wishlist' })"
          class="flex items-center justify-between bg-[#111318] border border-white/5 rounded-2xl px-6 py-4 hover:border-rose-500/30 transition-all duration-200 group"
        >
          <div class="flex items-center gap-3">
            <div class="w-9 h-9 bg-rose-500/10 rounded-xl flex items-center justify-center text-rose-400">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <span class="font-medium text-sm">Meus favoritos</span>
          </div>
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-white/20 group-hover:text-rose-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>

        <!-- Logout -->
        <button
          @click="handleLogout"
          class="flex items-center justify-between bg-[#111318] border border-white/5 rounded-2xl px-6 py-4 hover:border-rose-500/30 transition-all duration-200 group mt-2"
        >
          <div class="flex items-center gap-3">
            <div class="w-9 h-9 bg-rose-500/10 rounded-xl flex items-center justify-center text-rose-400">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </div>
            <span class="font-medium text-sm text-rose-400">Sair da conta</span>
          </div>
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-white/20 group-hover:text-rose-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/useAuthStore'
import { useOrderStore } from '@/stores/useOrderStore'
import { useWishlistStore } from '@/stores/useWishlistStore'

const router = useRouter()
const authStore = useAuthStore()
const orderStore = useOrderStore()
const wishlistStore = useWishlistStore()

const newName = ref('')
const saving = ref(false)
const nameError = ref('')
const nameSaved = ref(false)

onMounted(() => {
  newName.value = authStore.user?.name ?? ''
})

async function saveName() {
  nameError.value = ''
  nameSaved.value = false

  if (!newName.value.trim()) {
    nameError.value = 'Nome não pode ser vazio'
    return
  }

  saving.value = true
  try {
    authStore.updateName(newName.value.trim())
    nameSaved.value = true
    setTimeout(() => (nameSaved.value = false), 3000)
  } finally {
    saving.value = false
  }
}

function handleLogout() {
  if (confirm('Deseja sair da sua conta?')) {
    authStore.logout()
    router.push({ name: 'home' })
  }
}
</script>