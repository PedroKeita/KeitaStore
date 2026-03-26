<template>
  <div class="min-h-screen bg-[#0a0c10] text-white">
    <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

      <h1 class="text-3xl font-black mb-8">Checkout</h1>

      <!-- Stepper -->
      <div class="flex items-center gap-2 mb-10">
        <div
          v-for="(step, i) in steps"
          :key="i"
          class="flex items-center gap-2 flex-1"
        >
          <div class="flex items-center gap-2">
            <div
              class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 transition-all duration-200"
              :class="currentStep > i
                ? 'bg-cyan-500 text-black'
                : currentStep === i
                  ? 'bg-cyan-500/20 border-2 border-cyan-500 text-cyan-400'
                  : 'bg-white/5 border border-white/10 text-white/30'"
            >
              <svg v-if="currentStep > i" xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              <span v-else>{{ i + 1 }}</span>
            </div>
            <span
              class="text-sm font-medium hidden sm:block transition-colors duration-200"
              :class="currentStep >= i ? 'text-white' : 'text-white/30'"
            >{{ step }}</span>
          </div>
          <div v-if="i < steps.length - 1" class="flex-1 h-px mx-2 transition-colors duration-200" :class="currentStep > i ? 'bg-cyan-500' : 'bg-white/10'"></div>
        </div>
      </div>

      <!-- Etapa 1: Endereço -->
      <div v-if="currentStep === 0" class="flex flex-col gap-6">
        <h2 class="text-xl font-bold">Endereço de entrega</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">

          <!-- CEP -->
          <div class="flex flex-col gap-1">
            <label class="text-xs text-white/40 uppercase tracking-widest font-medium">CEP *</label>
            <input
              v-model="address.cep"
              type="tel"
              placeholder="00000-000"
              maxlength="9"
              class="input"
              :class="{ 'input-error': errors.cep }"
              @input="onCepInput"
            />
            <span v-if="errors.cep" class="text-xs text-rose-400">{{ errors.cep }}</span>
          </div>

          <!-- Rua -->
          <div class="flex flex-col gap-1 sm:col-span-2">
            <label class="text-xs text-white/40 uppercase tracking-widest font-medium">Rua *</label>
            <input v-model="address.street" type="text" placeholder="Nome da rua" class="input" :class="{ 'input-error': errors.street }" />
            <span v-if="errors.street" class="text-xs text-rose-400">{{ errors.street }}</span>
          </div>

          <!-- Número -->
          <div class="flex flex-col gap-1">
            <label class="text-xs text-white/40 uppercase tracking-widest font-medium">Número *</label>
            <input v-model="address.number" type="text" placeholder="123" class="input" :class="{ 'input-error': errors.number }" />
            <span v-if="errors.number" class="text-xs text-rose-400">{{ errors.number }}</span>
          </div>

          <!-- Bairro -->
          <div class="flex flex-col gap-1">
            <label class="text-xs text-white/40 uppercase tracking-widest font-medium">Bairro *</label>
            <input v-model="address.neighborhood" type="text" placeholder="Bairro" class="input" :class="{ 'input-error': errors.neighborhood }" />
            <span v-if="errors.neighborhood" class="text-xs text-rose-400">{{ errors.neighborhood }}</span>
          </div>

          <!-- Cidade -->
          <div class="flex flex-col gap-1">
            <label class="text-xs text-white/40 uppercase tracking-widest font-medium">Cidade *</label>
            <input v-model="address.city" type="text" placeholder="Cidade" class="input" :class="{ 'input-error': errors.city }" />
            <span v-if="errors.city" class="text-xs text-rose-400">{{ errors.city }}</span>
          </div>

          <!-- Estado -->
          <div class="flex flex-col gap-1">
            <label class="text-xs text-white/40 uppercase tracking-widest font-medium">Estado *</label>
            <input v-model="address.state" type="text" placeholder="UF" maxlength="2" class="input" :class="{ 'input-error': errors.state }" />
            <span v-if="errors.state" class="text-xs text-rose-400">{{ errors.state }}</span>
          </div>

        </div>
      </div>

      <!-- Etapa 2: Pagamento -->
      <div v-if="currentStep === 1" class="flex flex-col gap-6">
        <h2 class="text-xl font-bold">Forma de pagamento</h2>

        <!-- Opções -->
        <div class="grid grid-cols-3 gap-3">
          <button
            v-for="method in paymentMethods"
            :key="method.id"
            @click="payment.method = method.id"
            class="interactive press flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all duration-200"
            :class="payment.method === method.id ? 'border-cyan-500 bg-cyan-500/10 text-cyan-400' : 'border-white/10 bg-white/5 text-white/50 hover:border-white/20'"
          >
            <span class="text-2xl">{{ method.icon }}</span>
            <span class="text-xs font-medium">{{ method.label }}</span>
          </button>
        </div>

        <!-- Campos cartão -->
        <div v-if="payment.method === 'credit'" class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div class="flex flex-col gap-1 sm:col-span-2">
            <label class="text-xs text-white/40 uppercase tracking-widest font-medium">Número do cartão *</label>
            <input v-model="payment.cardNumber" type="tel" placeholder="0000 0000 0000 0000" maxlength="19" class="input" :class="{ 'input-error': errors.cardNumber }" @input="formatCardNumber" />
            <span v-if="errors.cardNumber" class="text-xs text-rose-400">{{ errors.cardNumber }}</span>
          </div>
          <div class="flex flex-col gap-1 sm:col-span-2">
            <label class="text-xs text-white/40 uppercase tracking-widest font-medium">Nome no cartão *</label>
            <input v-model="payment.cardName" type="text" placeholder="Nome como no cartão" class="input" :class="{ 'input-error': errors.cardName }" />
            <span v-if="errors.cardName" class="text-xs text-rose-400">{{ errors.cardName }}</span>
          </div>
          <div class="flex flex-col gap-1">
            <label class="text-xs text-white/40 uppercase tracking-widest font-medium">Validade *</label>
            <input v-model="payment.cardExpiry" type="tel" placeholder="MM/AA" maxlength="5" class="input" :class="{ 'input-error': errors.cardExpiry }" @input="formatExpiry" />
            <span v-if="errors.cardExpiry" class="text-xs text-rose-400">{{ errors.cardExpiry }}</span>
          </div>
          <div class="flex flex-col gap-1">
            <label class="text-xs text-white/40 uppercase tracking-widest font-medium">CVV *</label>
            <input v-model="payment.cardCvv" type="tel" placeholder="000" maxlength="4" class="input" :class="{ 'input-error': errors.cardCvv }" />
            <span v-if="errors.cardCvv" class="text-xs text-rose-400">{{ errors.cardCvv }}</span>
          </div>
        </div>

        <!-- Boleto info -->
        <div v-if="payment.method === 'boleto'" class="bg-white/5 border border-white/10 rounded-2xl p-4 text-sm text-white/60">
          O boleto será gerado após a confirmação do pedido. O prazo de vencimento é de 3 dias úteis.
        </div>

        <!-- PIX info -->
        <div v-if="payment.method === 'pix'" class="bg-white/5 border border-white/10 rounded-2xl p-4 text-sm text-white/60">
          O QR Code do PIX será exibido após a confirmação do pedido. O pagamento expira em 30 minutos.
        </div>
      </div>

      <!-- Etapa 3: Revisão -->
      <div v-if="currentStep === 2" class="flex flex-col gap-6">
        <h2 class="text-xl font-bold">Revisão do pedido</h2>

        <!-- Endereço -->
        <div class="bg-[#111318] border border-white/5 rounded-2xl p-4">
          <p class="text-xs text-white/30 uppercase tracking-widest font-medium mb-3">Endereço de entrega</p>
          <p class="text-sm text-white/80">{{ address.street }}, {{ address.number }}</p>
          <p class="text-sm text-white/80">{{ address.neighborhood }} — {{ address.city }}/{{ address.state }}</p>
          <p class="text-sm text-white/80">CEP: {{ address.cep }}</p>
        </div>

        <!-- Pagamento -->
        <div class="bg-[#111318] border border-white/5 rounded-2xl p-4">
          <p class="text-xs text-white/30 uppercase tracking-widest font-medium mb-3">Pagamento</p>
          <p class="text-sm text-white/80">
            {{ paymentMethods.find(m => m.id === payment.method)?.label }}
            <span v-if="payment.method === 'credit'"> — **** {{ payment.cardNumber.slice(-4) }}</span>
          </p>
        </div>

        <!-- Itens -->
        <div class="bg-[#111318] border border-white/5 rounded-2xl p-4">
          <p class="text-xs text-white/30 uppercase tracking-widest font-medium mb-3">Itens do pedido</p>
          <div class="flex flex-col divide-y divide-white/5">
            <div v-for="item in cartStore.items" :key="item.product.id" class="flex justify-between py-3 text-sm">
              <span class="text-white/70">{{ item.product.name }} <span class="text-white/30">x{{ item.quantity }}</span></span>
              <span class="font-medium">{{ formatPrice(item.product.price * item.quantity) }}</span>
            </div>
          </div>
          <div class="border-t border-white/5 pt-3 mt-1 flex flex-col gap-2 text-sm">
            <div class="flex justify-between text-white/50">
              <span>Subtotal</span>
              <span>{{ formatPrice(cartStore.subtotal) }}</span>
            </div>
            <div class="flex justify-between text-white/50">
              <span>Frete</span>
              <span :class="cartStore.shipping === 0 ? 'text-green-400' : ''">
                {{ cartStore.shipping === 0 ? 'Grátis' : formatPrice(cartStore.shipping) }}
              </span>
            </div>
            <div class="flex justify-between font-black text-base pt-1">
              <span>Total</span>
              <span>{{ formatPrice(cartStore.total) }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Botões de navegação -->
      <div class="flex justify-between mt-8">
        <button
          v-if="currentStep > 0"
          @click="currentStep--"
          class="press px-6 py-3 border border-white/10 rounded-xl text-white/60 hover:text-white hover:border-white/30 transition-all duration-200 text-sm font-medium"
        >
          ← Voltar
        </button>
        <div v-else></div>

        <button
          v-if="currentStep < 2"
          @click="nextStep"
          class="press px-8 py-3 bg-cyan-500 text-black font-bold rounded-xl hover:bg-cyan-400 active:scale-[0.97] transition-all duration-200"
        >
          Continuar →
        </button>

        <button
          v-else
          @click="confirmOrder"
          :disabled="!isFormValid"
          class="press px-8 py-3 bg-cyan-500 text-black font-bold rounded-xl hover:bg-cyan-400 active:scale-[0.97] transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-cyan-500"
        >
          Confirmar pedido
        </button>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '@/stores/useCartStore'
import { useOrderStore } from '@/stores/useOrderStore'

const router = useRouter()
const cartStore = useCartStore()
const orderStore = useOrderStore()

const currentStep = ref(0)
const steps = ['Endereço', 'Pagamento', 'Revisão']

const address = reactive({
  cep: '',
  street: '',
  number: '',
  neighborhood: '',
  city: '',
  state: '',
})

const payment = reactive({
  method: 'credit',
  cardNumber: '',
  cardName: '',
  cardExpiry: '',
  cardCvv: '',
})

const paymentMethods = [
  { id: 'credit', label: 'Cartão', icon: '💳' },
  { id: 'boleto', label: 'Boleto', icon: '📄' },
  { id: 'pix', label: 'PIX', icon: '⚡' },
]

const errors = reactive<Record<string, string>>({})

function formatPrice(value: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
}

// Auto-preenche endereço ao digitar CEP (mockado)
function onCepInput() {
  const cep = address.cep.replace(/\D/g, '')
  if (cep.length === 8) {
    address.street = 'Rua das Flores'
    address.neighborhood = 'Centro'
    address.city = 'Fortaleza'
    address.state = 'CE'
  }
  // Formata CEP
  address.cep = cep.replace(/(\d{5})(\d{1,3})/, '$1-$2')
}

function formatCardNumber() {
  payment.cardNumber = payment.cardNumber
    .replace(/\D/g, '')
    .replace(/(\d{4})(?=\d)/g, '$1 ')
    .trim()
}

function formatExpiry() {
  payment.cardExpiry = payment.cardExpiry
    .replace(/\D/g, '')
    .replace(/(\d{2})(\d{1,2})/, '$1/$2')
}

function validateStep0() {
  errors.cep = address.cep.length < 9 ? 'CEP inválido' : ''
  errors.street = !address.street ? 'Rua obrigatória' : ''
  errors.number = !address.number ? 'Número obrigatório' : ''
  errors.neighborhood = !address.neighborhood ? 'Bairro obrigatório' : ''
  errors.city = !address.city ? 'Cidade obrigatória' : ''
  errors.state = address.state.length < 2 ? 'Estado inválido' : ''
  return Object.values(errors).every(e => !e)
}

function validateStep1() {
  if (payment.method === 'credit') {
    errors.cardNumber = payment.cardNumber.replace(/\s/g, '').length < 16 ? 'Número inválido' : ''
    errors.cardName = !payment.cardName ? 'Nome obrigatório' : ''
    errors.cardExpiry = payment.cardExpiry.length < 5 ? 'Validade inválida' : ''
    errors.cardCvv = payment.cardCvv.length < 3 ? 'CVV inválido' : ''
    return Object.values(errors).every(e => !e)
  }
  return true
}

function nextStep() {
  if (currentStep.value === 0 && !validateStep0()) return
  if (currentStep.value === 1 && !validateStep1()) return
  currentStep.value++
}

const isFormValid = computed(() => {
  const addressOk = address.cep.length >= 9 && address.street && address.number && address.neighborhood && address.city && address.state.length >= 2
  const paymentOk = payment.method !== 'credit' || (
    payment.cardNumber.replace(/\s/g, '').length === 16 &&
    payment.cardName &&
    payment.cardExpiry.length === 5 &&
    payment.cardCvv.length >= 3
  )
  return addressOk && paymentOk
})

function confirmOrder() {
  if (!isFormValid.value) return
  const order = orderStore.addOrder(cartStore.items, cartStore.total, { ...address })
  cartStore.clear()
  router.push({ name: 'order-confirmation', query: { id: order.id } })
}
</script>

