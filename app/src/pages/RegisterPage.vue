<template>
  <div class="min-h-screen bg-[#0a0c10] text-white flex items-center justify-center px-4">
    <div class="w-full max-w-md">

      <!-- Logo -->
      <div class="flex flex-col items-center mb-10">
        <div class="w-12 h-12 bg-cyan-500 rounded-2xl flex items-center justify-center mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <h1 class="text-2xl font-black">Keita<span class="text-cyan-400">Store</span></h1>
        <p class="text-white/40 text-sm mt-1">Crie sua conta</p>
      </div>

      <!-- Card -->
      <div class="bg-[#111318] border border-white/5 rounded-3xl p-8">
        <h2 class="text-xl font-bold mb-2">Cadastrar</h2>
        <p class="text-white/40 text-sm mb-8">
          Crie sua conta para acessar pedidos, favoritos e muito mais.
        </p>

        <form @submit.prevent="handleRegister" class="space-y-4">

          <input
            v-model="name"
            type="text"
            placeholder="Seu nome"
            class="w-full px-4 py-3 rounded-xl bg-[#0a0c10] border border-white/10 focus:outline-none focus:border-cyan-400"
          />

          <input
            v-model="email"
            type="email"
            placeholder="Seu email"
            class="w-full px-4 py-3 rounded-xl bg-[#0a0c10] border border-white/10 focus:outline-none focus:border-cyan-400"
          />

          <input
            v-model="password"
            type="password"
            placeholder="Senha"
            class="w-full px-4 py-3 rounded-xl bg-[#0a0c10] border border-white/10 focus:outline-none focus:border-cyan-400"
          />

          <input
            v-model="confirmPassword"
            type="password"
            placeholder="Confirmar senha"
            class="w-full px-4 py-3 rounded-xl bg-[#0a0c10] border border-white/10 focus:outline-none focus:border-cyan-400"
          />

          <!-- BOTÃO IGUAL AO LOGIN -->
          <button
            type="submit"
            class="w-full flex items-center justify-center gap-3 py-3.5 bg-white text-gray-800 font-semibold rounded-xl hover:bg-gray-100 active:scale-[0.97] transition-all duration-200"
          >
            Criar conta
          </button>

        </form>

        <p class="text-center text-xs text-white/20 mt-6">
          Ao criar conta, você concorda com nossos termos.
        </p>
      </div>

      <!-- Voltar -->
      <button
        @click="router.push({ name: 'home' })"
        class="w-full mt-4 py-3 text-white/30 hover:text-white/60 transition-colors text-sm"
      >
        ← Voltar para a loja
      </button>

      <!-- Link login -->
      <p class="text-center text-sm text-white/40 mt-4">
        Já tem conta?
        <span
          @click="router.push('/login')"
          class="text-cyan-400 cursor-pointer hover:underline"
        >
          Entrar
        </span>
      </p>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/useAuthStore'
import { apiFetch } from '@/services/api'

const router = useRouter()
const authStore = useAuthStore()

const name = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')

async function handleRegister() {
  if (password.value !== confirmPassword.value) {
    alert('Senhas não coincidem')
    return
  }

  try {
    const res = await apiFetch('/user/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: name.value,
        email: email.value,
        password: password.value,
      }),
    })

    const data = await res.json()

    if (!res.ok) throw new Error(data.error)

    authStore.setUser(data)
    router.push('/')

  } catch (err: any) {
    alert(err.message)
  }
}
</script>