# Personal Language Assistant

A comprehensive English learning platform powered by AI. Built for Spanish speakers who want to learn English quickly and effectively using Google Gemini AI for personalized, real-time learning experiences.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18 + TypeScript + Vite + TailwindCSS |
| **Backend** | NestJS + TypeScript |
| **Database** | MongoDB 7 + Mongoose |
| **AI** | Google Gemini API (`@google/generative-ai`) |
| **Real-time** | WebSockets (Socket.io) |
| **Auth** | JWT (access token + refresh token) |
| **Infrastructure** | Docker + Docker Compose |
| **State Management** | Zustand |
| **Charts** | Recharts |
| **Animations** | Framer Motion |

## Features

### 1. Personal Coach
Generate a personalized 30-day learning plan based on your level, goal (travel, exams, business, daily conversation), and available daily time. Includes weekly checkpoints and mini-tests with visual progress tracking.

### 2. Thinking in English
Stop translating in your head. Learn 25 everyday English phrases grouped by context (home, work, travel, shopping) with pronunciation guides, native variations, and interactive flip-card quizzes.

### 3. Real-Time Conversation Practice
Chat with Gemini acting as a native English speaker via WebSocket. Choose your topic (restaurant, airport, office, friends) and CEFR level (A1-B2). Get natural corrections with explanations in Spanish. Full conversation history saved.

### 4. Naturalness Detector
Paste your English sentences and receive corrected versions, more natural alternatives, and explanations of the differences. Configurable tone: casual, polite, or professional.

### 5. Vocabulary That Sticks
Generate curated word lists (30/50/100 words) by context (travel, business, customer service, daily life). Each word includes meaning, example, pronunciation, collocations, and memory tricks. Auto-generated tests: fill-in-the-blank, reverse translation, mini-dialogues.

### 6. Quick Grammar
Enter any grammar topic and get a concise explanation in Spanish, 10 real-life examples, 5 common mistakes, and progressive exercises. The system adapts follow-up questions based on your weak points.

### 7. Pronunciation Coach
Learn the top 10 pronunciation mistakes for Spanish speakers with mouth/tongue position guides, minimal pairs, daily exercises, shadowing phrases, and self-evaluation checklists. Paste any sentence for syllable-by-syllable breakdown.

### 8. Immersion Plan
Get personalized content recommendations (podcasts, YouTube, movies, tech, gaming, finance) matched to your level and interests. Includes target vocabulary, speaking/writing exercises, and summary tasks adapted to your daily time budget.

### 9. Situation Simulator
Practice real-life scenarios: ordering food, job interviews, hotel check-in, sales calls, doctor visits, networking. Roleplay with gradual difficulty increases, unexpected challenges, and post-session corrections with fluent alternatives.

### 10. Mistake Pattern Analyzer
Paste your English texts and get grouped error patterns, explanations of why you make them, corrected examples, personalized drills, and a "do this / not that" table. Errors are saved to MongoDB with progress reports.

## Prerequisites

- **Node.js** 20+
- **npm** or **yarn**
- **Docker** (optional, for containerized setup)
- **Docker Compose** (optional)
- **Google Gemini API key** ([how to get one](#how-to-get-a-gemini-api-key))

## Setup

### Local Development

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd personal-language-assistant
   ```

2. **Set up environment variables**

   ```bash
   cp .env.example .env
   ```

   Edit `.env` with your values (see [Environment Variables](#environment-variables)).

3. **Start MongoDB** (via Docker or local installation)

   ```bash
   docker run -d --name mongodb -p 27017:27017 -v mongodb_data:/data/db mongo:7
   ```

4. **Install and start the backend**

   ```bash
   cd backend
   npm install
   npm run start:dev
   ```

   The backend runs at `http://localhost:4000`.

5. **Install and start the frontend**

   ```bash
   cd frontend
   npm install
   npm run dev
   ```

   The frontend runs at `http://localhost:3000`.

### Docker Setup

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd personal-language-assistant
   ```

2. **Set up environment variables**

   ```bash
   cp .env.example .env
   ```

   Edit `.env` with your values.

3. **Start all services**

   ```bash
   docker compose up --build
   ```

   This starts three services:
   - **Frontend**: `http://localhost:3000`
   - **Backend**: `http://localhost:4000`
   - **MongoDB**: `localhost:27017`

   Both frontend and backend have hot reload enabled in development mode.

4. **Stop services**

   ```bash
   docker compose down
   ```

   To also remove MongoDB data:

   ```bash
   docker compose down -v
   ```

## Environment Variables

Copy `.env.example` to `.env` and configure the following:

| Variable | Description | Example |
|----------|-------------|---------|
| `GEMINI_API_KEY` | Your Google Gemini API key | `AIzaSy...` |
| `JWT_SECRET` | Secret for signing access tokens | `your_secret_key` |
| `JWT_REFRESH_SECRET` | Secret for signing refresh tokens | `your_refresh_secret` |
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/english-learning` |
| `NODE_ENV` | Environment mode | `development` / `production` |
| `PORT` | Backend server port | `4000` |

> **Note**: In Docker Compose, the `MONGODB_URI` is automatically set to `mongodb://mongodb:27017/english-learning` to connect to the MongoDB container.

## API Documentation

The backend exposes interactive API documentation via Swagger UI:

```
http://localhost:4000/api
```

This includes all endpoints for authentication, user management, learning plans, modules, conversations, and progress tracking.

### Key Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/auth/register` | Register a new user |
| `POST` | `/auth/login` | Login and receive JWT tokens |
| `POST` | `/auth/refresh` | Refresh an expired access token |
| `GET` | `/users/me` | Get current user profile |
| `PATCH` | `/users/me` | Update current user profile |
| `POST` | `/learning-plan/generate` | Generate a 30-day learning plan |
| `GET` | `/learning-plan/active` | Get active learning plan |
| `PATCH` | `/learning-plan/day/:dayNumber/complete` | Mark a day as complete |
| `POST` | `/modules/:moduleName/generate` | Generate content for any module |
| `GET` | `/conversations/:sessionId` | Get a conversation session |
| `GET` | `/conversations/history` | Get all conversation history |
| `GET` | `/progress/summary` | Get progress summary |
| `GET` | `/progress/mistakes` | Get mistake analysis report |

### WebSocket Events (Conversation Module)

| Event | Direction | Description |
|-------|-----------|-------------|
| `joinSession` | Client → Server | Start a new conversation session |
| `sendMessage` | Client → Server | Send a message to the AI |
| `receiveMessage` | Server → Client | Receive AI response with corrections |
| `endSession` | Client → Server | End the conversation session |

## Project Structure

```
personal-language-assistant/
├── backend/                    # NestJS backend
│   ├── src/
│   │   ├── auth/               # Authentication (JWT, register, login)
│   │   ├── users/              # User management
│   │   ├── learning-plan/      # 30-day plan generation and tracking
│   │   ├── modules/            # 10 learning modules
│   │   │   ├── coach/          # Personal learning plan
│   │   │   ├── thinking/       # Thinking in English
│   │   │   ├── conversation/   # Real-time conversation
│   │   │   ├── naturalness/    # Naturalness detector
│   │   │   ├── vocabulary/     # Vocabulary builder
│   │   │   ├── grammar/        # Quick grammar
│   │   │   ├── pronunciation/  # Pronunciation coach
│   │   │   ├── immersion/      # Immersion plan
│   │   │   ├── simulation/     # Situation simulator
│   │   │   └── mistakes/       # Mistake pattern analyzer
│   │   ├── gemini/             # Gemini AI service
│   │   ├── prompts/            # AI prompt templates
│   │   ├── progress/           # Progress tracking
│   │   ├── websocket/          # WebSocket gateway
│   │   ├── common/             # Shared utilities and guards
│   │   ├── app.module.ts
│   │   └── main.ts
│   ├── Dockerfile
│   └── package.json
├── frontend/                   # React frontend
│   ├── src/
│   │   ├── pages/              # Page components (one per module)
│   │   ├── components/
│   │   │   ├── ui/             # Reusable UI components
│   │   │   ├── modules/        # Module-specific components
│   │   │   └── layout/         # Layout components (sidebar, navbar)
│   │   ├── store/              # Zustand state management
│   │   ├── hooks/              # Custom React hooks
│   │   ├── services/           # API services (Axios)
│   │   ├── socket/             # WebSocket client setup
│   │   ├── types/              # TypeScript type definitions
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   ├── Dockerfile
│   └── package.json
├── docker-compose.yml          # Docker Compose configuration
├── .env.example                # Environment variables template
└── README.md
```

## How to Get a Gemini API Key

1. Go to [Google AI Studio](https://aistudio.google.com/)
2. Sign in with your Google account
3. Click on **"Get API key"** in the left sidebar
4. Click **"Create API key in new project"** (or select an existing project)
5. Copy the generated API key
6. Paste it into your `.env` file:

   ```env
   GEMINI_API_KEY=your_api_key_here
   ```

> **Note**: The Gemini API has a generous free tier. Check [Google AI pricing](https://ai.google.dev/pricing) for current limits.

## Available Scripts

### Backend

| Command | Description |
|---------|-------------|
| `npm run start:dev` | Start backend with hot reload |
| `npm run start:prod` | Start production build |
| `npm run build` | Build the project |
| `npm run lint` | Run ESLint with auto-fix |
| `npm run format` | Format code with Prettier |
| `npm run test` | Run unit tests |
| `npm run test:cov` | Run tests with coverage |

### Frontend

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server with hot reload |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
