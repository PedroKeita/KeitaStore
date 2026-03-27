<div align="center">

# ⚡ KeitaStore

### E-commerce de Tech & Eletrônicos

**Frontend moderno e responsivo com autenticação real, carrinho persistente e acessibilidade auditiva.**

[![Vue.js](https://img.shields.io/badge/Vue.js-3.x-4FC08D?style=flat-square&logo=vue.js)](https://vuejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.x-38BFF8?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-5.x-646CFF?style=flat-square&logo=vite)](https://vitejs.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](LICENSE)

🔗 **[Demo ao vivo](https://keita-store.vercel.app)** · 📦 **[Repositório](https://github.com/PedroKeita/KeitaStore)**

</div>

---

## Índice

- [Sobre o projeto](#sobre-o-projeto)
- [Funcionalidades](#funcionalidades)
- [Diferenciais](#diferenciais)
- [Stack e decisões técnicas](#stack-e-decisões-técnicas)
- [Arquitetura do projeto](#arquitetura-do-projeto)
- [Testes unitários](#testes-unitários)
- [Pipeline CI/CD](#pipeline-cicd)
- [Como rodar localmente](#como-rodar-localmente)
- [Variáveis de ambiente](#variáveis-de-ambiente)
- [Como testar](#como-testar)
- [Fluxo de autenticação](#fluxo-de-autenticação)
- [Persistência de dados](#persistência-de-dados)
- [API](#api)
- [Melhorias futuras](#melhorias-futuras)
- [Time](#time)
- [Documentação de produto](#documentação-de-produto)

---

## Sobre o projeto

KeitaStore é um e-commerce de tecnologia e eletrônicos desenvolvido para o hackathon de frontend. O objetivo foi entregar uma experiência de compra completa, fluida e acessível, com identidade visual sólida, navegação intuitiva e diferenciais que vão além do MVP.

A loja cobre o ciclo completo de compra: descoberta de produtos → detalhe → favoritos → carrinho → checkout → confirmação de pedido, com autenticação real via Google OAuth e e-mail/senha integrada a um backend Node.js hospedado no Render.

---

## Funcionalidades

### Catálogo
- Home com banner principal, produtos em destaque e seção de categorias
- Listagem com filtro por categoria e busca em tempo real (debounce 300ms)
- Busca case-insensitive e sem distinção de acentos
- Estado da busca refletido na URL via query params (`?q=headphone&category=audio`)
- Página de detalhe do produto com galeria de imagens, especificações técnicas, avaliação e produtos relacionados
- Breadcrumb de navegação em todas as páginas internas

### Carrinho
- Adicionar, remover e atualizar quantidade de itens
- Subtotal, frete simulado (grátis acima de R$ 299) e total em tempo real
- Persistência por usuário via `localStorage` com chave `cart_{userId}`
- Feedback visual ao adicionar (botão muda para "Adicionado!" por 2 segundos)
- Drawer lateral no desktop, tela cheia no mobile

### Checkout
- Fluxo de 3 etapas: Endereço → Pagamento → Revisão
- Stepper visual indicando progresso
- Validação de campos obrigatórios antes de avançar
- Opções de pagamento: cartão de crédito, boleto e PIX
- Tela de confirmação com número do pedido gerado automaticamente
- Histórico de pedidos persistido no store durante a sessão

### Autenticação
- Login e registro com e-mail e senha via API real
- Login com Google OAuth 2.0
- Sessão persistida via JWT no `localStorage`
- Navigation guards protegendo rotas de perfil, checkout e pedidos
- Logout com limpeza completa do estado

### Favoritos
- Favoritar e desfavoritar em qualquer card ou página de detalhe
- Página dedicada `/favoritos` com grid e opção de "Adicionar tudo ao carrinho"
- Persistência por usuário via `localStorage` com chave `wishlist_{userId}`
- Estado vazio com CTA para explorar produtos

### Perfil e pedidos
- Página de perfil com dados do usuário e edição de nome
- Histórico de pedidos com status, data, itens e valor total

---

## Diferenciais

### Acessibilidade auditiva — Text-to-Speech
Botão de alto-falante em cada card e na página de detalhe. Ao clicar, a **Web Speech API** lê em voz alta o nome do produto, categoria, preço e desconto em português brasileiro (`pt-BR`). O botão indica visualmente quando está lendo e para ao clicar novamente. O recurso é ocultado automaticamente em browsers sem suporte.


### Login com Google OAuth
Autenticação real via Google OAuth 2.0, integrada ao backend. O usuário é redirecionado para a página do Google e, após autenticar, retorna automaticamente para a página de origem.

### Micro-animações e feedback visual
- Animação de pulso no coração ao favoritar
- Botão do carrinho com animação de scale ao adicionar item
- Hover com zoom suave nas imagens dos cards
- Drawers com transição de `translateX`
- Toasts com slide-in e fade-out
- Todas as animações respeitam `prefers-reduced-motion`

### Identidade visual coesa
Design escuro com paleta cyan/preto inspirada em interfaces de tech premium. Tipografia clara, hierarquia visual bem definida e componentes consistentes em todas as telas.

---

## Stack e decisões técnicas

| Tecnologia | Decisão |
|---|---|
| **Vue 3 + Composition API** | Melhor ergonomia com TypeScript, reatividade granular e melhor performance com `<script setup>` |
| **TypeScript** | Segurança de tipos em todo o projeto, especialmente nos stores e nas chamadas à API |
| **Vite** | Build extremamente rápido com HMR instantâneo durante o desenvolvimento |
| **Tailwind CSS** | Desenvolvimento ágil com utilitários, sem overhead de CSS não utilizado em produção |
| **Pinia** | Store oficial do Vue 3, mais simples que Vuex, tipagem nativa e DevTools integrado |
| **Vue Router 4** | Roteamento com lazy loading por rota, reduzindo o bundle inicial |
| **VueUse** | Composables utilitários prontos (`useStorage`, `useMediaQuery`) sem reinventar a roda |
| **localStorage por usuário** | Persistência de carrinho e favoritos vinculada ao `userId`, sem necessidade de rotas extras no backend para o hackathon |


## Testes unitários
 
O módulo de autenticação do backend conta com testes unitários escritos com **Vitest**, cobrindo os cenários mais críticos do fluxo de auth.
 
### O que é testado
 
| Cenário | Descrição |
|---|---|
| **Registro de usuário** | Valida que um novo usuário é criado corretamente com senha hasheada e retorna os dados esperados |
| **Login com e-mail e senha** | Verifica credenciais corretas, retorno do JWT e rejeição de senha inválida |
| **Geração de JWT** | Confirma que o token é gerado com o payload correto (`userId`, `email`) e asssinado com a chave secreta |
| **Validação de JWT** | Testa que tokens válidos são aceitos, tokens expirados são rejeitados e tokens adulterados falham |
| **Login com Google OAuth** | Valida o fluxo de callback, criação/atualização do usuário e geração do token após autenticação Google |
 
### Como rodar os testes
 
```bash
# Na pasta da API
cd api
 
# Instalar dependências (se ainda não instalou)
npm install
 
# Rodar todos os testes
npm run test
 
# Rodar em modo watch (re-executa ao salvar)
npm run test:watch
 
# Ver cobertura de código
npm run test:coverage
```
 
### Exemplo de saída esperada
 
```
✓ auth > registro > deve criar usuário com senha hasheada
✓ auth > registro > deve rejeitar e-mail já cadastrado
✓ auth > login > deve retornar JWT com credenciais válidas
✓ auth > login > deve rejeitar senha incorreta
✓ auth > jwt > deve gerar token com payload correto
✓ auth > jwt > deve rejeitar token expirado
✓ auth > jwt > deve rejeitar token adulterado
✓ auth > google > deve criar usuário na primeira autenticação
✓ auth > google > deve atualizar usuário existente no callback
 
Test Files  1 passed (1)
Tests       9 passed (9)
```
 
---
 
## Pipeline CI/CD
 
O projeto utiliza **GitHub Actions** para garantir qualidade e automatizar o deploy a cada Pull Request e merge na `develop` ou `main`.
 
### Fluxo do pipeline
 
```
Push / Pull Request
        ↓
┌─────────────────────────────┐
│         CI Pipeline         │
│                             │
│  1. Checkout do código      │
│  2. Setup Node.js 18        │
│  3. npm install             │
│  4. Lint (ESLint)           │
│  5. Type check (vue-tsc)    │
│  6. Testes unitários        │
│  7. Build de produção       │
└─────────────────────────────┘
        ↓ (apenas na main)
┌─────────────────────────────┐
│         CD Pipeline         │
│                             │
│  Deploy automático          │
│  Vercel (frontend)          │
│  Render (backend)           │
└─────────────────────────────┘
```
 
### Arquivo de workflow
 
O pipeline está definido em `.github/workflows/ci.yml` e roda automaticamente em:
 
- Todo `push` para `develop` ou `main`
- Todo Pull Request aberto contra `develop` ou `main`
 
Nenhum código chega à `main` sem passar por lint, type check, testes e build com sucesso. Isso garante que a branch principal sempre esteja em estado deployável.
 
---

### Por que localStorage em vez de banco de dados para carrinho e favoritos?

O backend foi desenvolvido com foco em autenticação (registro, login, Google OAuth). Para o escopo do hackathon, persistir carrinho e favoritos no banco exigiria criar e documentar novas rotas de API, aumentando o escopo sem agregar valor visível ao avaliador. A solução adotada — `localStorage` com chave por `userId` — garante que cada conta veja apenas seus próprios dados, funciona offline e tem zero latência de rede. É uma decisão consciente e documentada, não uma limitação técnica.

---

## Arquitetura do projeto

```
keitastore/
├── app/                          # Frontend Vue.js
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/               # Componentes genéricos (Button, Toast, Skeleton...)
│   │   │   ├── product/          # ProductCard, ProductGallery, ProductSpecs
│   │   │   ├── cart/             # CartDrawer, CartItem, CartSummary
│   │   │   └── layout/           # AppHeader, AppFooter
│   │   ├── pages/                # Uma página por rota
│   │   │   ├── HomePage.vue
│   │   │   ├── ProductListPage.vue
│   │   │   ├── ProductDetailPage.vue
│   │   │   ├── CartPage.vue
│   │   │   ├── CheckoutPage.vue
│   │   │   ├── OrderConfirmationPage.vue
│   │   │   ├── WishlistPage.vue
│   │   │   ├── ProfilePage.vue
│   │   │   ├── OrderHistoryPage.vue
│   │   │   ├── LoginPage.vue
│   │   │   ├── RegisterPage.vue
│   │   │   └── AuthCallbackPage.vue
│   │   ├── stores/               # Pinia stores
│   │   │   ├── useAuthStore.ts
│   │   │   ├── useCartStore.ts
│   │   │   ├── useWishlistStore.ts
│   │   │   └── useOrderStore.ts
│   │   ├── router/
│   │   │   └── index.ts          # Rotas + navigation guards
│   │   ├── services/
│   │   │   └── api.ts            # apiFetch com JWT automático
│   │   ├── composables/
│   │   │   └── useSpeech.ts      # Web Speech API
│   │   ├── data/
│   │   │   ├── products.ts       # Mock com 12 produtos
│   │   │   └── categories.ts     # 6 categorias
│   │   └── types/
│   │       └── index.ts          # Interfaces TypeScript
│   └── ...
└── api/                          # Backend Node.js (Render)
    └── ...
```

---

## Como rodar localmente

### Pré-requisitos

- Node.js 18 ou superior
- npm 9 ou superior
- Git

### Instalação

```bash
# Clone o repositório
git clone https://github.com/PedroKeita/KeitaStore.git
cd KeitaStore/app

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.example .env
# Edite o .env com suas variáveis (ver seção abaixo)

# Inicie o servidor de desenvolvimento
npm run dev
```

Acesse `http://localhost:5174`

### Outros comandos

```bash
# Verificar erros de TypeScript
npx vue-tsc --noEmit

# Lint e correção automática
npm run lint

# Formatar código
npm run format

# Build de produção
npm run build

# Preview do build
npm run preview
```

---

## Variáveis de ambiente

Crie um arquivo `.env` na raiz do `app/` com as seguintes variáveis:

```env
# URL da API backend
VITE_API_URL=https://keitastore-api.onrender.com

# Para desenvolvimento local com backend local
# VITE_API_URL=http://localhost:3213
```

> O arquivo `.env` não é versionado. Nunca commite chaves ou segredos.

---

## Como testar

### 1. Registro de conta

1. Acesse `/register`
2. Preencha nome, e-mail e senha
3. Clique em "Criar conta"

> **Atenção:** ao registrar com sucesso, o navegador exibe um alerta com o conteúdo `[object Response]` ou similar. Isso é um comportamento conhecido do ambiente atual — **significa que o registro funcionou corretamente**. Feche o alerta e vá para `/login` para entrar com sua conta recém-criada.

### 2. Login com e-mail e senha

1. Acesse `/login`
2. Insira o e-mail e senha cadastrados
3. Clique em "Entrar"
4. Você será redirecionado para a home com seu nome no header

### 3. Login com Google

1. Acesse `/login`
2. Clique em "Entrar com Google"
3. Escolha sua conta Google
4. Você será redirecionado de volta para a loja automaticamente

> Se aparecer erro `redirect_uri_mismatch`, aguarde alguns minutos — o Google leva até 5 minutos para propagar novas URIs cadastradas.

### 4. Favoritos

1. Faça login (obrigatório para favoritar)
2. Clique no ícone de coração em qualquer card
3. Acesse `/favoritos` para ver sua lista
4. Os favoritos ficam salvos para sua conta específica

### 5. Carrinho e checkout

1. Faça login (obrigatório para adicionar ao carrinho)
2. Adicione produtos ao carrinho pelo card ou página de detalhe
3. Acesse o carrinho e ajuste quantidades
4. Clique em "Finalizar compra"
5. Preencha endereço → pagamento → revise e confirme
6. Você será redirecionado para a tela de confirmação com número do pedido

### 6. Acessibilidade auditiva (TTS)

1. Em qualquer card de produto, clique no ícone de alto-falante
2. O site lerá em voz alta o nome, categoria e preço do produto
3. Clique novamente para parar
4. Funciona em Chrome, Edge e Safari — não disponível no Firefox


---

## Fluxo de autenticação

```
Usuário clica "Entrar com Google"
        ↓
Frontend redireciona para /auth/google no backend
        ↓
Backend redireciona para accounts.google.com
        ↓
Usuário autoriza no Google
        ↓
Google redireciona para /auth/google/callback no backend
        ↓
Backend gera JWT e redireciona para o frontend com ?token=...
        ↓
AuthCallbackPage.vue captura o token, salva no localStorage
e chama authStore.setUser()
        ↓
Usuário é redirecionado para a página de origem
```

O JWT é enviado automaticamente em todas as requisições pelo `apiFetch` via header `Authorization: Bearer {token}`.

---

## Persistência de dados

| Dado | Onde é salvo | Chave |
|---|---|---|
| Token JWT | `localStorage` | `token` |
| Carrinho | `localStorage` | `cart_{userId}` |
| Favoritos | `localStorage` | `wishlist_{userId}` |
| Preferência de tema | `localStorage` | `theme` |
| Histórico de pedidos | Pinia store (memória) | — |

Cada usuário tem suas próprias chaves de carrinho e favoritos, garantindo que contas diferentes na mesma máquina não compartilhem dados.

---

## API

A API está hospedada em `https://keitastore-api.onrender.com`.

> O Render hiberna serviços gratuitos após 15 minutos de inatividade. A primeira requisição pode demorar até 30 segundos para "acordar" o servidor.

### Endpoints disponíveis

| Método | Rota | Descrição | Auth |
|---|---|---|---|
| `POST` | `/user/register` | Criar conta com e-mail e senha | Não |
| `POST` | `/user/login` | Login com e-mail e senha | Não |
| `GET` | `/auth/google` | Iniciar fluxo OAuth Google | Não |
| `GET` | `/auth/google/callback` | Callback OAuth Google | Não |
| `GET` | `/auth/me` | Retorna dados do usuário logado | Sim |
| `PUT` | `/user/me` | Atualiza nome do usuário | Sim |

---

## Melhorias futuras

Funcionalidades que ficaram fora do escopo do hackathon mas estão planejadas:

- **Rotas de carrinho e favoritos no backend** — persistir no banco de dados em vez do `localStorage`, sincronizando entre dispositivos
- **Correção do alerta no registro** — parsear corretamente a resposta da API e exibir uma mensagem amigável em vez do objeto `Response`
- **Busca avançada** — filtro por faixa de preço, ordenação por preço/avaliação e filtros combinados
- **Paginação** — carregamento incremental de produtos com scroll infinito ou paginação clássica
- **Testes automatizados** — testes unitários nos stores com Vitest e testes de componente com Vue Test Utils
- **PWA** — transformar em Progressive Web App com suporte offline e instalação no dispositivo
- **Notificações push** — alertar sobre promoções e atualizações de pedidos
- **Internacionalização** — suporte a múltiplos idiomas com Vue i18n
- **Avaliações reais** — sistema de review de produtos com nota e comentário
- **Dark Mode** — Filtro que muda tema do site de modo claro para noturno ou vice-versa
---

## Time

| Nome | Papel | GitHub |
|---|---|---|
| Pedro Keita | Tech Lead · Frontend · Backend | [@PedroKeita](https://github.com/PedroKeita) |
| Gisele Toledo | Frontend · UI/UX | [@giseletoledo](https://github.com/giseletoledo) |
| Rikson Valeriano | Product Owner | [@riksonvaleriano](https://github.com/riksonvaleriano) |

---

## Documentação de produto

O planejamento completo do projeto está documentado com épicas, user stories e critérios de aceitação detalhados para cada funcionalidade.

📄 **[Ver épicas e user stories completas](/KeitaStore/docs/epicas-user-stories)**