# Levav Talent Afrika — Local Development Guide

## Quick Start (2 minutes)

```bash
# 1. Install dependencies
npm install

# 2. Start the fullstack dev server
npm run dev

# 3. Open http://localhost:5173
```

The dev server starts:
- **Frontend:** http://localhost:5173 (Vite HMR)
- **Backend API:** http://localhost:3000 (Hono + tRPC)

Both auto-reload on file changes.

---

## Environment Setup

### 1. Copy environment file
```bash
cp .env.example .env
```

### 2. Edit `.env` with your credentials

Required variables:
```env
# App credentials (from Kimi platform)
APP_ID=your_app_id
APP_SECRET=your_app_secret

# Database (MySQL from Supabase or any provider)
DATABASE_URL=mysql://user:pass@host:port/database

# Kimi platform URLs
KIMI_AUTH_URL=https://auth.kimi.com
KIMI_OPEN_URL=https://open.kimi.com

# Optional: Owner union ID for admin access
OWNER_UNION_ID=your_union_id
```

### 3. Database Setup

The project uses Drizzle ORM with MySQL.

```bash
# Push schema to database (creates all tables)
npx drizzle-kit push

# Or generate migration files
npx drizzle-kit generate
npx drizzle-kit migrate
```

---

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start frontend dev server (Vite) |
| `npm run build` | Build frontend + backend for production |
| `npm run start` | Start production backend server |
| `npm run check` | TypeScript type check |
| `npm run lint` | ESLint check |
| `npm run format` | Prettier format all files |
| `npm run db:generate` | Generate Drizzle migration |
| `npm run db:push` | Push schema to database |
| `npm run test` | Run Vitest tests |

---

## Project Structure

```
app/
├── api/                    # Backend (Hono + tRPC)
│   ├── boot.ts            # Server entry point
│   ├── router.ts          # tRPC router registry
│   ├── middleware.ts      # Auth + role guards
│   ├── context.ts         # Request context builder
│   ├── local-auth-router.ts   # Email/password auth
│   ├── auth-router.ts     # Kimi OAuth
│   ├── lib/               # Utilities
│   ├── queries/           # Database queries
│   ├── routers/           # tRPC routers (23 total)
│   └── services/          # Business logic
├── db/
│   └── schema.ts          # Database schema (38 tables)
├── src/                   # Frontend (React + Vite)
│   ├── pages/             # Route pages (36+)
│   ├── components/        # UI components
│   ├── hooks/             # Custom hooks
│   ├── lib/               # Utilities + demo data
│   └── providers/         # Context providers
├── contracts/             # Shared constants
└── dist/                  # Build output
```

---

## Authentication Modes

### Local Auth (Email + Password)
- Register with name, email, password
- Auto-verified in dev mode
- JWT stored in localStorage

### Kimi OAuth ("Levav Sign-In")
- Uses Kimi platform authentication
- Requires APP_ID and APP_SECRET
- Session cookie-based

### Demo Mode (No Backend)
- Click "Enter Demo Mode" on login page
- Browse all pages with sample data
- No backend server required

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, TypeScript, Vite |
| Styling | Tailwind CSS, shadcn/ui |
| Animations | Framer Motion |
| Backend | Hono, tRPC 11, Drizzle ORM |
| Database | MySQL (via mysql2) |
| Auth | bcryptjs, jose (JWT), Kimi OAuth |
| Charts | Recharts |
| Icons | Lucide React |

---

## Troubleshooting

### "Cannot find module" errors
```bash
npm install
```

### Database connection fails
- Check DATABASE_URL format: `mysql://user:password@host:port/dbname`
- Ensure MySQL server is accessible from your IP
- For Supabase: use Connection Pooler URL

### TypeScript errors
```bash
npm run check
```

### Build fails
```bash
# Clean and rebuild
rm -rf dist node_modules
npm install
npm run build
```

---

## Contributing

1. Create feature branch
2. Make changes with TypeScript strict mode
3. Run `npm run check` before committing
4. Build with `npm run build` to verify

---

*Levav Talent Afrika — Africa's Workforce Intelligence Ecosystem*
