Quiero construir una aplicación web completa para aprender inglés de forma rápida y efectiva usando IA en tiempo real. A continuación te doy la arquitectura, los módulos funcionales, el diseño y todos los detalles necesarios.

---

## STACK TECNOLÓGICO

- **Frontend**: React 18 + TypeScript + Vite
- **Backend**: NestJS + TypeScript
- **Base de datos**: MongoDB con Mongoose
- **IA**: Google Gemini API
- **Infraestructura**: Docker + Docker Compose
- **Autenticación**: JWT (access token + refresh token)
- **Comunicación en tiempo real**: WebSockets (Socket.io) para el asistente conversacional

---

## ESTRUCTURA DEL PROYECTO
/
├── frontend/         # React app
├── backend/          # NestJS app
├── docker-compose.yml
└── .env.example

---

## MÓDULOS FUNCIONALES

La app tiene 10 módulos principales basados en metodología de aprendizaje con IA:

### 1. COACH PERSONAL (Personal Learning Plan)
- El usuario define: nivel (beginner/intermediate/advanced), objetivo (viajes, examen, clientes, conversación diaria), tiempo disponible por día (minutos), semanas/meses para alcanzar la meta.
- Gemini genera un plan de 30 días con tareas diarias: speaking, listening, vocabulario, gramática y repaso.
- Checkpoints semanales y mini-test cada 7 días.
- Guardar el plan en MongoDB y mostrar progreso visual (barra de progreso por día).

### 2. PENSAMIENTO EN INGLÉS (Stop Translating in Your Head)
- Gemini genera 25 pensamientos cotidianos en inglés agrupados por situación: hogar, trabajo, viajes, compras.
- Cada frase incluye: frase natural, significado literal, guía de pronunciación, variación nativa.
- Quiz aleatorio interactivo hasta que el usuario responda sin ver la tarjeta (flip card UI).

### 3. PRÁCTICA DE CONVERSACIÓN EN TIEMPO REAL (Real Conversation Practice)
- Chat en tiempo real via WebSocket con Gemini actuando como hablante nativo.
- El usuario elige: tema (restaurante, aeropuerto, primera cita, oficina, amigos), nivel CEFR (A1/A2/B1/B2).
- Gemini hace preguntas de una en una, corrige naturalmente, explica el error en español, continúa la conversación.
- Historial de conversación guardado en MongoDB.

### 4. DETECTOR DE NATURALIDAD (Sound Less Robotic)
- El usuario pega sus frases en inglés.
- Gemini devuelve para cada frase: versión del usuario, versión corregida, versión más natural, explicación de la diferencia, cuándo usar cada una.
- Tono configurable: casual / polite / professional.

### 5. VOCABULARIO QUE SE QUEDA (Vocabulary That Sticks)
- El usuario elige: cantidad (30/50/100 palabras), contexto (viajes, citas, negocios, servicio al cliente, vida diaria).
- Gemini genera lista con: palabra/frase, significado, ejemplo, pronunciación, colocación común, truco de memoria.
- Tests automáticos: fill-in-the-blank, traducción inversa, mini diálogos.

### 6. GRAMÁTICA RÁPIDA (Fix Grammar Fast)
- El usuario ingresa el tema gramatical (e.g., "present perfect", "conditionals").
- Gemini explica la regla en menos de 5 líneas en español, da 10 ejemplos de vida cotidiana, muestra 5 errores comunes y genera ejercicios de fácil a difícil.
- Tras responder, corrige y genera 5 nuevas preguntas basadas en puntos débiles.

### 7. MEJORA DE PRONUNCIACIÓN (Pronunciation Coach)
- Gemini entrega: top 10 errores de pronunciación para hispanohablantes, posición de boca/lengua, pares mínimos, ejercicios diarios, frases de shadowing, checklist de auto-evaluación.
- El usuario puede pegar una frase y Gemini la divide en sílabas mostrando dónde acentuar y pausar.

### 8. PLAN DE INMERSIÓN (Immersion Plan)
- El usuario elige contenido favorito: podcasts, YouTube, películas, fútbol, belleza, tech, finanzas, gaming.
- Gemini recomienda contenido justo por encima de su nivel con: por qué aplica a su nivel, qué escuchar, 10 palabras que escuchará, ejercicio de speaking, ejercicio de writing, tarea de resumen.
- Adaptado a X minutos por día.

### 9. SIMULADOR DE SITUACIONES (Real-Life Simulation)
- El usuario elige situación: pedir comida, entrevista de trabajo, check-in hotel, llamada de ventas, médico, networking.
- Gemini muestra banco de frases útiles, luego hace el roleplay completo paso a paso.
- Dificultad gradual: preguntas de seguimiento, jerga, problemas inesperados.
- Después de cada respuesta: corrección + versión más fluida y natural.

### 10. ANÁLISIS DE ERRORES PERSONALIZADOS (Mistake Pattern Analyzer)
- El usuario pega sus textos o respuestas en inglés.
- Gemini analiza y devuelve: patrones de errores agrupados, por qué los comete, ejemplos corregidos, drill personalizado por patrón, tabla "do this / not that", versión reescrita en su nivel.
- Los errores se guardan en MongoDB y se genera reporte de progreso con foco para la próxima sesión.

---

## MODELOS DE DATOS (MongoDB / Mongoose)

### User
```ts
{
  _id, email, passwordHash, name, nativeLanguage: 'es',
  targetLanguage: 'en', level: 'beginner'|'intermediate'|'advanced',
  goal: string, dailyMinutes: number, createdAt, updatedAt
}
```

### LearningPlan
```ts
{
  userId, days: [{ dayNumber, tasks: [{ type, description, completed }] }],
  weeklyCheckpoints: [{ week, summary, miniTestScore }], startDate, active
}
```

### ConversationSession
```ts
{
  userId, module: string, topic: string, level: string,
  messages: [{ role: 'user'|'assistant', content, corrections: [{original, corrected, explanation}], timestamp }],
  createdAt
}
```

### VocabularySet
```ts
{
  userId, context: string, words: [{ word, meaning, example, pronunciation, collocation, memoryTrick, mastered }], createdAt
}
```

### MistakeLog
```ts
{
  userId, sessionId, pattern: string, examples: [{ wrong, correct, explanation }],
  drills: [string], frequency: number, lastSeen: Date
}
```

### Progress
```ts
{
  userId, date, module, score, timeSpent, notes
}
```

---

## API ENDPOINTS (NestJS)

### Auth
- POST /auth/register
- POST /auth/login
- POST /auth/refresh

### User
- GET /users/me
- PATCH /users/me

### Learning Plan
- POST /learning-plan/generate
- GET /learning-plan/active
- PATCH /learning-plan/day/:dayNumber/complete

### Modules (todos con POST /modules/:moduleName/generate)
- coach, thinking, vocabulary, grammar, pronunciation, immersion, simulation, mistakes

### Conversations (WebSocket + REST)
- WS: joinSession, sendMessage, endSession
- GET /conversations/:sessionId
- GET /conversations/history

### Progress
- GET /progress/summary
- GET /progress/mistakes

---

## INTEGRACIÓN CON GEMINI

Usar `@google/generative-ai` SDK en NestJS.

Crear un `GeminiService` con:
- `generateText(systemPrompt: string, userPrompt: string): Promise<string>`
- `streamChat(systemPrompt: string, history: ChatMessage[]): AsyncIterable<string>` (para WebSocket)

Cada módulo tiene su propio prompt template con variables dinámicas según los parámetros del usuario. Los prompts deben estar en `backend/src/prompts/` como archivos `.ts` con funciones que reciban parámetros y retornen el string del prompt completo en inglés.

El sistema siempre instruye a Gemini para que sus explicaciones sean en español cuando sea necesario (para usuarios hispanohablantes aprendiendo inglés).

---

## FRONTEND (React + TailwindCSS)

### Diseño Visual
- Tema oscuro por defecto con opción de claro
- Estética: moderna, educativa, motivadora. Colores primarios: azul eléctrico (#3B82F6) + verde (#10B981) sobre fondo oscuro (#0F172A).
- Tipografía: `Outfit` (display) + `Inter` (body) via Google Fonts
- Componentes animados con Framer Motion
- Sidebar de navegación con los 10 módulos
- Dashboard de progreso con gráficas (recharts)

### Páginas principales
1. `/` - Landing/Login
2. `/dashboard` - Panel de progreso general
3. `/plan` - Plan de 30 días visual
4. `/coach` - Módulo 1
5. `/thinking` - Módulo 2 (flip cards)
6. `/conversation` - Módulo 3 (chat en tiempo real)
7. `/naturalness` - Módulo 4
8. `/vocabulary` - Módulo 5
9. `/grammar` - Módulo 6
10. `/pronunciation` - Módulo 7
11. `/immersion` - Módulo 8
12. `/simulation` - Módulo 9
13. `/mistakes` - Módulo 10

### Estado global: Zustand
### HTTP client: Axios con interceptores JWT
### WebSocket: socket.io-client

---

## DOCKER COMPOSE

Servicios:
- `frontend`: React app (puerto 3000)
- `backend`: NestJS app (puerto 4000)
- `mongodb`: MongoDB 7 (puerto 27017)

Incluir:
- `.env.example` con todas las variables necesarias (GEMINI_API_KEY, JWT_SECRET, MONGODB_URI, etc.)
- Volúmenes para persistencia de MongoDB
- Hot reload en desarrollo para ambos servicios

---

## ESTRUCTURA DE CARPETAS SUGERIDA

### Backend (NestJS)
src/
├── auth/
├── users/
├── learning-plan/
├── modules/
│   ├── coach/
│   ├── thinking/
│   ├── conversation/
│   ├── naturalness/
│   ├── vocabulary/
│   ├── grammar/
│   ├── pronunciation/
│   ├── immersion/
│   ├── simulation/
│   └── mistakes/
├── gemini/
├── prompts/
├── progress/
├── websocket/
└── common/

### Frontend (React)
src/
├── pages/
├── components/
│   ├── ui/
│   ├── modules/
│   └── layout/
├── store/ (zustand)
├── hooks/
├── services/ (axios)
├── socket/
└── types/

---

## INSTRUCCIONES DE IMPLEMENTACIÓN

1. Comenzar por el `docker-compose.yml` y estructura base de carpetas.
2. Implementar el backend: auth, users, geminiService, y luego módulo por módulo.
3. Implementar el frontend con la estructura de páginas y navegación primero.
4. Integrar WebSocket para el módulo de conversación.
5. Asegurarse de que cada módulo guarde su sesión/resultado en MongoDB.
6. Generar el README con instrucciones de instalación local y con Docker.

Crear el proyecto completo, funcional y listo para desarrollo. No omitas ningún archivo importante. Incluye comentarios relevantes en el código y usa TypeScript estricto en todo el proyecto.