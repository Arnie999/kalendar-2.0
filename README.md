# Edward-Kalendář

Moderní kalendářová aplikace pro správu francouzských událostí a plánování.

## 🚀 Tech Stack

- **Runtime**: Node.js 22 LTS
- **Package Manager**: pnpm 10
- **Monorepo**: Turborepo 3
- **Frontend**: Next.js 14 s Turbopack
- **Admin UI**: Vite 5 + React 18
- **Styling**: Tailwind CSS 4
- **Testing**: Vitest 2 + Playwright 2
- **Linting**: Biome 1
- **Backend**: Firebase 12 / Supabase 3
- **Monitoring**: Sentry 8

## 📁 Struktura projektu

```
Kalendar_francie_v2/
├── apps/
│   ├── web/          # Hlavní Next.js aplikace
│   └── admin/        # Admin panel (Vite)
├── packages/
│   ├── shared/       # Sdílené utility a typy
│   └── ui/           # UI komponenty
├── e2e/              # E2E testy (Playwright)
└── .github/          # GitHub Actions
```

## 🛠️ Vývoj

### Předpoklady

- Node.js 22 LTS
- pnpm 10

### Instalace

\`\`\`bash
# Klonování repozitáře
git clone [repository-url]
cd Kalendar_francie_v2

# Instalace závislostí
pnpm install

# Kopírování environment variables
cp .env.example .env.local
\`\`\`

### Spuštění dev serveru

\`\`\`bash
# Spuštění všech aplikací
pnpm dev

# Nebo jednotlivě:
pnpm --filter web dev          # http://localhost:3000
pnpm --filter admin dev        # http://localhost:3001
\`\`\`

### Testing

\`\`\`bash
# Unit testy
pnpm test:unit

# E2E testy
pnpm test:e2e

# Všechny testy
pnpm test
\`\`\`

### Linting a formátování

\`\`\`bash
# Kontrola kódu
pnpm lint

# Automatické opravy
pnpm lint:fix
\`\`\`

### Build

\`\`\`bash
# Build všech aplikací
pnpm build

# Build konkrétní aplikace
pnpm --filter web build
pnpm --filter admin build
\`\`\`

## 🏗️ Aplikace

### Web App (`/apps/web`)
- Next.js 14 s App Router
- Server-side rendering
- Optimalizace s Turbopack
- Tailwind CSS 4

### Admin Panel (`/apps/admin`)
- Vite 5 + React 18
- Single Page Application
- React Router
- TanStack Query

## 📊 Monitoring

- **Chyby**: Sentry 8
- **Analytics**: Google Analytics 4
- **Performance**: Core Web Vitals

## 🚀 Deployment

Aplikace je připravena pro deployment na:
- **Web**: Vercel (Next.js)
- **Admin**: Statické hosting (Netlify, Vercel)
- **Database**: Firebase / Supabase

## 📄 Licence

Private project - všechna práva vyhrazena. 