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
        <p class="text-white/40 text-sm mt-1">Faça login para continuar</p>
      </div>

      <!-- Card -->
      <div class="bg-[#111318] border border-white/5 rounded-3xl p-8">
        <h2 class="text-xl font-bold mb-2">Entrar na conta</h2>
        <p class="text-white/40 text-sm mb-8">
          Acesse sua conta para ver pedidos, favoritos e mais.
        </p>

        <!-- FORM -->
        <form @submit.prevent="handleEmailLogin" class="space-y-4">

          <input
            v-model="email"
            type="email"
            placeholder="Seu email"
            class="w-full px-4 py-3 rounded-xl bg-[#0a0c10] border border-white/10 focus:outline-none focus:border-cyan-400"
          />

          <input
            v-model="password"
            type="password"
            placeholder="Sua senha"
            class="w-full px-4 py-3 rounded-xl bg-[#0a0c10] border border-white/10 focus:outline-none focus:border-cyan-400"
          />

          <!-- BOTÃO IGUAL AO REGISTER -->
          <button
            type="submit"
            class="w-full flex items-center justify-center gap-3 py-3.5 bg-white text-gray-800 font-semibold rounded-xl hover:bg-gray-100 active:scale-[0.97] transition-all duration-200"
          >
            Entrar
          </button>

        </form>

        <!-- DIVIDER -->
        <div class="my-6 flex items-center gap-3">
          <div class="flex-1 h-px bg-white/10"></div>
          <span class="text-white/30 text-xs">ou</span>
          <div class="flex-1 h-px bg-white/10"></div>
        </div>

        <!-- GOOGLE -->
        <button
          @click="handleLogin"
          class="w-full flex items-center justify-center gap-3 py-3.5 bg-white text-gray-800 font-semibold rounded-xl hover:bg-gray-100 active:scale-[0.97] transition-all duration-200"
        >

        <!-- Ícone Google -->
        <svg class="w-5 h-5" viewBox="0 0 48 48">
          <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
          <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
          <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
          <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
        </svg>

  <span>Entrar com Google</span>
</button>

        <p class="text-center text-xs text-white/20 mt-6">
          Ao entrar, você concorda com nossos termos.
        </p>
      </div>

      <!-- Voltar -->
      <button
        @click="router.push({ name: 'home' })"
        class="w-full mt-4 py-3 text-white/30 hover:text-white/60 transition-colors text-sm"
      >
        ← Voltar para a loja
      </button>

      <!-- Link register -->
      <p class="text-center text-sm text-white/40 mt-4">
        Não tem conta?
        <span
          @click="router.push('/register')"
          class="text-cyan-400 cursor-pointer hover:underline"
        >
          Criar conta
        </span>
      </p>

    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/useAuthStore'
import { ref } from 'vue'
import { apiFetch } from '@/services/api'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const email = ref('')
const password = ref('')


function handleLogin() {
  const redirect = route.query.redirect as string | undefined
  if (redirect) localStorage.setItem('redirectAfterLogin', redirect)

  const API = import.meta.env.VITE_API_URL
  window.location.href = `${API}/auth/google`
}

async function handleEmailLogin() {
  try {
    const res = await apiFetch('/user/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: email.value,
        password: password.value,
      }),
    })

    const data = await res.json()

    if (!res.ok) throw new Error(data.error)

    authStore.setUser(data)

    const redirect = localStorage.getItem('redirectAfterLogin')
    if (redirect) {
      localStorage.removeItem('redirectAfterLogin')
      router.push(redirect)
    } else {
      router.push({ name: 'home' })
    }

  } catch (err: any) {
    alert(err.message)
  }
}

async function handleRegister() {
  try {
    const res = await apiFetch('/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: email.value.split('@')[0],
        email: email.value,
        password: password.value,
      }),
    })

    const data = await res.json()

    if (!res.ok) throw new Error(data.error)

    authStore.setUser(data)
    router.push({ name: 'home' })

  } catch (err: any) {
    alert(err.message)
  }
}
</script>