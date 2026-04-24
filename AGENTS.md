# AGENTS.md — Personal Language Assistant

## Project Overview

English learning platform for Spanish speakers. Two packages: NestJS backend + React/Vite frontend. MongoDB for persistence, Google Gemini AI for content generation, Socket.io for real-time conversation.

## Commands

### Backend (`cd backend`)
| Command | Purpose |
|---------|---------|
| `npm run start:dev` | Dev server with hot reload (port 4000) |
| `npm run build` | Compile via `nest build` |
| `npm run start:prod` | Run compiled output |
| `npm run lint` | ESLint --fix |
| `npm run format` | Prettier --write |
| `npm run test` | Jest (tests live in `src/` as `*.spec.ts`) |
| `npm run test:cov` | Jest with coverage |

### Frontend (`cd frontend`)
| Command | Purpose |
|---------|---------|
| `npm run dev` | Vite dev server (port 3000) |
| `npm run build` | `tsc && vite build` |
| `npm run preview` | Preview production build |

### Docker (root)
| Command | Purpose |
|---------|---------|
| `docker compose up --build` | Start all 3 services (frontend, backend, mongodb) |
| `docker compose down -v` | Stop + wipe MongoDB data |

### Setup order
1. MongoDB running (Docker or local on 27017)
2. Backend (`npm run start:dev`)
3. Frontend (`npm run dev`)

## Architecture

### Backend structure (`backend/src/`)
- **Feature modules** under `modules/`: coach, thinking, conversation, naturalness, vocabulary, grammar, pronunciation, immersion, simulation, mistakes
- Each module follows: `*.module.ts`, `*.controller.ts`, `*.service.ts`, `dto/`, `schemas/`
- **`gemini/`** — `GeminiService` wraps `@google/generative-ai` (model: `gemini-1.5-flash`). Methods: `generateText`, `generateJson` (regex-parsed), `streamChat` (async iterable)
- **`prompts/`** — Prompt templates as `.ts` files exporting functions. One per module
- **`websocket/`** — `AppGateway` handles Socket.io connections, validates JWT on connect
- **`conversation/`** — Has its own `ConversationGateway` for real-time chat streaming
- **`common/`** — JWT auth guard, roles guard/decorator, `@CurrentUser()` decorator
- **`main.ts`** — Global `ValidationPipe` with `whitelist: true` + `forbidNonWhitelisted: true` (unknown DTO fields cause 400). Swagger UI at `/api`

### Frontend structure (`frontend/src/`)
- **`pages/`** — One component per route + Landing. All authenticated pages wrapped in `<Layout>`
- **`store/`** — Zustand: `authStore` (JWT state), `themeStore` (dark/light)
- **`services/`** — Axios-based API clients. `api.ts` sets base URL and JWT interceptors
- **`socket/`** — `conversationSocket.ts` manages Socket.io client lifecycle
- **`components/`** — `ui/` (ProgressBar, FlipCard, LoadingSpinner), `layout/` (Sidebar, Topbar, Navbar, Layout)
- Routes: `/` (Landing), `/dashboard`, `/plan`, `/coach`, `/thinking`, `/conversation`, `/naturalness`, `/vocabulary`, `/grammar`, `/pronunciation`, `/immersion`, `/simulation`, `/mistakes`

## Key gotchas

- **No test files exist** — Jest is configured in backend but `backend/test/` is empty and no `*.spec.ts` files exist in `src/`. Frontend has no test framework at all
- **`.env.example` does not exist** — `.env` is gitignored. Required vars: `GEMINI_API_KEY`, `JWT_SECRET`, `JWT_REFRESH_SECRET`, `MONGODB_URI`, `NODE_ENV`, `PORT`
- **Docker `MONGODB_URI` override** — docker-compose.yml sets `mongodb://mongodb:27017/english-learning` (service name, not localhost). Local dev uses `mongodb://localhost:27017/english-learning`
- **`generateJson` uses regex parsing** — `GeminiService.generateJson()` extracts JSON via `/\{[\s\S]*\}/` then `JSON.parse`. Fragile if Gemini returns multiple JSON blocks
- **`forbidNonWhitelisted` is on** — Any DTO field not decorated with `@ApiProperty()` / class-validator will cause a 400 error
- **WebSocket auth** — Token passed via `handshake.auth.token` or `handshake.query.token`. Invalid tokens are silently ignored (connection proceeds without `userId`)
- **Nested `<Routes>` in App.tsx** — Authenticated routes use a nested `<Routes>` inside `<Layout>`. This is an anti-pattern but functional; be careful adding new routes

## Conventions

- All AI explanations in Spanish (prompts instruct Gemini accordingly)
- DTOs use `class-validator` decorators
- Schemas use Mongoose `@Prop()` / `@Schema()` decorators
- Frontend uses TailwindCSS (v3), Framer Motion, Recharts, Lucide icons
- TypeScript strict mode in both packages
