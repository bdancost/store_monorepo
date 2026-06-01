# ⚡ LUXTECH — Premium E-commerce Platform

<div align="center">

![LUXTECH Banner](https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1200&h=300&fit=crop&q=80)

**Full-stack e-commerce platform built with NestJS + Next.js**

[![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)](https://nestjs.com)
[![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://typescriptlang.org)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://postgresql.org)
[![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://prisma.io)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)

[Demo ao vivo](#) · [Documentação da API](#) · [Reportar bug](#)

</div>

---

## 📋 Índice

- [Sobre o projeto](#-sobre-o-projeto)
- [Arquitetura](#-arquitetura)
- [Tech stack](#-tech-stack)
- [Features implementadas](#-features-implementadas)
- [Conceitos técnicos aplicados](#-conceitos-técnicos-aplicados)
- [Como rodar](#-como-rodar)
- [Testes](#-testes)
- [Estrutura de pastas](#-estrutura-de-pastas)
- [Variáveis de ambiente](#-variáveis-de-ambiente)
- [Decisões de arquitetura](#-decisões-de-arquitetura)

---

## 🚀 Sobre o projeto

LUXTECH é uma plataforma completa de e-commerce premium desenvolvida do zero como projeto de portfólio para demonstrar competências em desenvolvimento full-stack de nível pleno/sênior.

O projeto abrange **todo o ciclo de desenvolvimento profissional**:

- Modelagem de banco de dados relacional com Prisma + PostgreSQL
- API REST segura com autenticação JWT, guards e validação com Zod
- Frontend responsivo com Next.js, Framer Motion e design system próprio
- Comunicação em tempo real com WebSocket (Socket.IO)
- Testes unitários e e2e com Jest + React Testing Library
- PWA com Service Worker e estratégias de cache
- CI/CD com deploy automatizado

> Este projeto foi construído intencionalmente com foco em **boas práticas**, **padrões de arquitetura** e **qualidade de código** — não apenas em fazer funcionar.

---

## 🏗 Arquitetura

```
my-store-monorepo/
├── apps/
│   ├── backend/          # API REST — NestJS + Prisma + PostgreSQL
│   └── frontend/         # SPA/SSR — Next.js + Tailwind + Framer Motion
├── docker-compose.yml    # PostgreSQL local
└── README.md
```

### Fluxo de dados

```
Browser → Next.js (SSR/CSR)
             ↓
        Axios + Interceptors (JWT automático)
             ↓
        NestJS API (Guards → Controllers → Services)
             ↓
        Prisma ORM → PostgreSQL
             ↑
        WebSocket (Socket.IO) ← Notificações em tempo real
```

---

## 🛠 Tech Stack

### Backend

| Tecnologia | Versão | Uso |
|---|---|---|
| NestJS | 10.x | Framework principal — módulos, DI, guards |
| TypeScript | 5.x | Tipagem estática em todo o projeto |
| Prisma ORM | 5.x | ORM type-safe, migrations, relations |
| PostgreSQL | 15.x | Banco de dados relacional principal |
| JWT + Bcrypt | — | Autenticação e hash de senhas |
| Zod | 3.x | Validação de schema em runtime |
| Socket.IO | 4.x | WebSocket para notificações em tempo real |
| Jest | 29.x | Testes unitários e e2e |
| Helmet | — | Headers de segurança HTTP |
| Throttler | — | Rate limiting (10 req/min) |

### Frontend

| Tecnologia | Versão | Uso |
|---|---|---|
| Next.js | 14.x | Framework React com SSR/SSG |
| TypeScript | 5.x | Tipagem estática |
| Tailwind CSS | 3.x | Utilitários CSS |
| Framer Motion | 11.x | Animações e transições |
| Axios | 1.x | HTTP client com interceptors |
| Socket.IO Client | 4.x | WebSocket client |
| React Testing Library | 14.x | Testes de componentes |
| Jest | 29.x | Test runner |

---

## ✅ Features implementadas

### 🔐 Autenticação & Segurança
- [x] Registro e login com hash bcrypt (salt rounds: 10)
- [x] JWT com expiração configurável
- [x] AuthGuard protegendo rotas privadas
- [x] Rate limiting global (10 req/60s)
- [x] Headers de segurança com Helmet
- [x] Validação de env vars no boot (JWT_SECRET mínimo 32 chars)
- [x] Proteção contra user enumeration attack

### 🛒 E-commerce Core
- [x] Catálogo com 100+ produtos (sync automático da DummyJSON API)
- [x] Carrinho persistente por usuário (um por conta)
- [x] Ownership validation — usuário só acessa seus próprios dados
- [x] Sistema de pedidos com status flow: `PENDING → PAID → SHIPPED → DELIVERED`
- [x] Snapshot de preço no momento da compra (OrderItem.price)
- [x] Cancelamento com regra de negócio (apenas PENDING e PAID)
- [x] Transações Prisma para operações atômicas

### 🔔 Tempo real
- [x] WebSocket com Socket.IO
- [x] Autenticação JWT no handshake
- [x] Rooms por usuário (suporte a múltiplas abas)
- [x] Notificação automática ao mudar status do pedido
- [x] Ping/pong keepalive (30s) para proxies corporativos

### 🎨 Frontend
- [x] Design system premium preto + dourado
- [x] Header responsivo com relógio em tempo real
- [x] Command Palette global (⌘K) com fuzzy search próprio
- [x] Skeleton screens inteligentes (zero CLS)
- [x] PWA com Service Worker e estratégias de cache
- [x] Parallax multi-camada com Framer Motion
- [x] Animações com `whileInView`, `layoutId` e `AnimatePresence`
- [x] Toast notifications com auto-dismiss
- [x] Cart drawer com preview sem sair da página
- [x] Filtros, busca com debounce e ordenação client-side
- [x] Paginação com 12 itens por página

### 📄 Páginas
- [x] Auth (Login/Register) com switch animado
- [x] Shop com filtros, busca e categorias
- [x] Eletrônicos, Gadgets e Ofertas com hero parallax
- [x] Carrinho com Optimistic UI e controle de quantidade
- [x] Checkout com máquina de estados
- [x] Pedidos com timeline de status e cancelamento
- [x] Perfil com estatísticas derivadas
- [x] Sobre Nós com storytelling e timeline histórica
- [x] Carreiras com 12 vagas e filtro por departamento
- [x] Blog com parallax por card e posts por categoria
- [x] Imprensa com ticker ao vivo e media kit
- [x] Central de Ajuda com busca + highlight de termos
- [x] Fale Conosco com chat simulado e formulário adaptativo
- [x] Trocas e Devoluções com wizard 4 etapas
- [x] Rastrear Pedido com timeline animada

### 🧪 Testes
- [x] Unitários backend: AuthService, CartService, OrdersService
- [x] Unitários frontend: useClock, useProductFilters, useOrderSummary
- [x] Hooks de negócio: useAuth, useCartItem, useCheckout
- [x] Componentes: StatusBadge, OrderCard, ProductCard
- [x] E2E: registro de usuário, login/logout, fluxo de autenticação

---

## 🧠 Conceitos técnicos aplicados

### Backend

**Módulos NestJS com injeção de dependência**
Cada domínio (auth, users, products, cart, orders) tem seu próprio módulo com providers, controllers e services isolados. O `PrismaModule` é `@Global()` — disponível em todos os módulos sem reimportar.

**Validação em camadas**
- Zod valida o schema dos DTOs em runtime
- Guards validam autenticação antes de chegar no controller
- Services validam regras de negócio (ownership, status de pedido)

**Transações Prisma**
O `createFromCart` usa `$transaction` para garantir atomicidade: se o `cartItem.deleteMany` falhar, o `order.create` é revertido automaticamente.

**Snapshot de preço**
`OrderItem.price` armazena o preço no momento da compra. Se o produto mudar de preço depois, pedidos antigos mostram o valor correto — crítico em sistemas de billing.

**WebSocket Gateway**
O `NotificationsGateway` autentica via JWT no handshake, organiza conexões em rooms por userId e expõe `notifyUser()` para outros services chamarem diretamente.

### Frontend

**Optimistic UI**
No `useCartItem`, a quantidade é atualizada na tela imediatamente. A API é chamada com debounce de 600ms. Se falhar, reverte para o valor anterior via `useRef`.

**Derived state**
`useOrderSummary` calcula subtotal, frete e total com `useMemo` — sem `useState` extra. Um estado derivado de outro nunca deve ser armazenado separadamente.

**Máquina de estados**
`useCheckout` usa `"idle" | "loading" | "success" | "error"` em vez de `boolean loading`. Impossibilita estados contraditórios e permite feedback específico por estado.

**Fuzzy search próprio**
A Command Palette implementa fuzzy search sem biblioteca: percorre o texto verificando se todos os caracteres da query aparecem na mesma ordem. Adiciona score de relevância (exato > começa com > contém > fuzzy).

**Service Worker com estratégias de cache**
- `CacheFirst` para assets estáticos (1 ano TTL)
- `NetworkFirst` para chamadas de API (5 min TTL)
- `StaleWhileRevalidate` para páginas (24h TTL)

---

## 🚀 Como rodar

### Pré-requisitos

- Node.js 18+
- Docker e Docker Compose
- npm ou yarn

### 1. Clone o repositório

```bash
git clone https://github.com/seu-usuario/my-store-monorepo.git
cd my-store-monorepo
```

### 2. Suba o banco de dados

```bash
docker-compose up -d
```

### 3. Configure o backend

```bash
cd apps/backend
cp .env.example .env
# Edite o .env com suas variáveis

npm install
npx prisma migrate dev
npm run start:dev
```

### 4. Configure o frontend

```bash
cd apps/frontend
cp .env.local.example .env.local
# Edite o .env.local

npm install
npm run dev
```

### 5. Acesse

| Serviço | URL |
|---|---|
| Frontend | http://localhost:3001 |
| Backend API | http://localhost:3000/api/v1 |
| Swagger Docs | http://localhost:3000/api/docs |
| PostgreSQL | localhost:5434 |

---

## 🧪 Testes

```bash
# Backend — unitários
cd apps/backend
npm run test

# Backend — e2e
npm run test:e2e

# Backend — cobertura
npm run test:cov

# Frontend — unitários
cd apps/frontend
npm run test

# Frontend — watch mode
npm run test:watch

# Frontend — cobertura (mínimo 70%)
npm run test:coverage
```

---

## 📁 Estrutura de pastas

```
apps/
├── backend/
│   ├── src/
│   │   ├── auth/              # JWT, guards, login, registro
│   │   ├── cart/              # Carrinho com ownership validation
│   │   ├── common/
│   │   │   ├── filters/       # Global exception filter
│   │   │   └── pipes/         # ZodValidationPipe
│   │   ├── config/            # Validação de env vars com Zod
│   │   ├── notifications/     # WebSocket Gateway (Socket.IO)
│   │   ├── orders/            # Pedidos com status flow
│   │   ├── prisma/            # PrismaService + PrismaModule global
│   │   ├── products/          # CRUD + sync DummyJSON
│   │   └── users/             # Registro de usuários
│   ├── prisma/
│   │   ├── schema.prisma      # Models: User, Cart, Product, Order...
│   │   └── migrations/        # Histórico de migrations
│   └── test/                  # Testes e2e
│
└── frontend/
    └── src/
        ├── components/
        │   ├── auth/          # LoginForm, RegisterForm
        │   ├── cart/          # CartDrawer, QuantityControl, OrderSummary
        │   ├── command/       # CommandPalette
        │   ├── layout/        # Header, Footer, Clock, MobileMenu
        │   ├── notifications/ # NotificationsBell
        │   ├── orders/        # OrderCard, StatusBadge, CancelOrderModal
        │   ├── pwa/           # InstallBanner
        │   ├── shop/          # ProductCard, ProductGrid, Filters
        │   └── ui/            # Skeleton, ThemeToggle, StatCard
        ├── contexts/          # Cart, Toast, Notifications, CommandPalette
        ├── hooks/             # 20+ hooks organizados por domínio
        ├── pages/             # 20+ páginas — shop, cart, orders, suporte
        ├── services/          # Axios instance com interceptors
        └── styles/            # globals.css, skeleton.css
```

---

## 🔐 Variáveis de ambiente

### Backend (`apps/backend/.env`)

```env
# Banco de dados
DATABASE_URL="postgresql://user:password@localhost:5434/store_db?schema=public"

# JWT — mínimo 32 caracteres (validado no boot)
JWT_SECRET="sua_chave_super_secreta_minimo_32_caracteres_aqui"

# Ambiente
NODE_ENV=development

# Frontend URL (para CORS do WebSocket)
FRONTEND_URL=http://localhost:3001
```

### Frontend (`apps/frontend/.env.local`)

```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api/v1
```

---

## 🏛 Decisões de arquitetura

### Por que monorepo?
Frontend e backend compartilham tipos e ficam em um único repositório para facilitar manutenção, versionamento conjunto e CI/CD unificado.

### Por que Zod em vez de class-validator?
Zod é type-safe por design — o tipo TypeScript é inferido automaticamente do schema. Com `class-validator`, você escreve a validação e o tipo separadamente, correndo risco de dessincronização.

### Por que Prisma em vez de TypeORM?
Prisma gera tipos TypeScript diretamente do schema, garantindo que o banco e o código estejam sempre sincronizados. TypeORM requer decorators e tem tipos menos precisos.

### Por que snapshot de preço?
Se um produto muda de preço após a compra, o histórico de pedidos deve mostrar o valor original. Sem snapshot, `OrderItem.product.price` mostraria o preço atual — erro de billing.

### Por que derived state com useMemo?
Armazenar em `useState` algo que pode ser calculado cria dois estados que precisam ser sincronizados manualmente — fonte clássica de bugs. `useMemo` calcula automaticamente quando a dependência muda.

---

## 📊 Cobertura de testes

| Módulo | Testes | Cobertura |
|---|---|---|
| AuthService | 8 testes | Hashing, login, JWT, erros |
| CartService | 7 testes | CRUD, ownership, transactions |
| OrdersService | 9 testes | Criação, cancel, regras de negócio |
| useClock | 6 testes | Formatação, debounce, cleanup |
| useProductFilters | 11 testes | Filtros, busca, ordenação, paginação |
| useOrderSummary | 8 testes | Cálculos, frete, edge cases |
| useAuth | 7 testes | Login, register, logout, loading |
| useCartItem | 6 testes | Optimistic UI, debounce, reverter |
| useCheckout | 7 testes | State machine, duplo clique, erros |
| StatusBadge | 6 testes | Todos os status, ícones, dot |
| OrderCard | 9 testes | Render, navegação, cancelamento |
| ProductCard | 8 testes | Render, add to cart, feedback |

---

## 👤 Autor

**Daniel Fernandes**

Desenvolvedor Full-stack focado em NestJS, React/Next.js e TypeScript.
Construindo sistemas completos com foco em boas práticas e arquitetura limpa.

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://linkedin.com/in/seu-perfil)
[![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/seu-usuario)

---

## 📄 Licença

MIT — veja [LICENSE](LICENSE) para detalhes.

---

<div align="center">

Feito com ☕ e muita dedicação

**⚡ LUXTECH** — Do backend ao frontend, do banco ao browser.

</div>
