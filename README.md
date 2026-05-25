# Curso de ingles practico para analisis de datos

Curso aterrizado: poca teoria, mucha practica diaria. Enfocado en analisis de datos: hablar, escribir y explicar hallazgos en ingles sin sonar artificial.

## Arquitectura full stack (MVP real)

- Frontend: Vite + HTML/CSS/JS.
- Backend: Node.js + Express.
- Persistencia: JSON store en `server/data/store.json`.
- API: estadisticas, leaderboard, case of the day, logging de eventos.

Endpoints clave:

- GET `/api/health`
- GET `/api/stats/overview`
- GET `/api/stats/modules`
- GET `/api/stats/engagement`
- GET `/api/stats/leaderboard`
- GET `/api/case-of-day`
- POST `/api/events`

## MVP Web listo para primer deploy

Este repositorio incluye una version web navegable del curso.

### Ruta Data confiable e interactiva

Ruta principal:
- database foundations
- database design
- programming with SQL
- communication and storytelling

Archivo principal:
- ruta-data-interactiva.md

Incluye:
- progresion de menos a mas
- retos de salida en ingles
- fuentes confiables verificadas
- plan de imagenes para familiarizacion

## Como ejecutar local

1. Instala dependencias:

npm install

2. Levanta entorno full stack (frontend + backend):

npm run dev

3. Abre la URL de Vite (normalmente http://localhost:5173).

Tambien puedes correr solo backend:

npm run dev:backend

Backend por defecto en:

http://localhost:8787

## Build de verificacion

npm run build

Se genera dist para despliegue estatico.

## Deploy rapido

### Opcion Vercel

1. Importa el repo en Vercel.
2. Framework preset: Vite.
3. Build command: npm run build.
4. Output directory: dist.

### Opcion Netlify

1. New site from Git.
2. Build command: npm run build.
3. Publish directory: dist.

### Opcion full stack (Render/Railway/Fly)

Usa un servicio Node para levantar backend y servir frontend compilado:

1. Build command: `npm run build`
2. Start command: `npm run start`
3. Port: usa variable `PORT` del proveedor (el server ya la respeta).

## Como empezar hoy (15 min)

1. Abre semana-01.md y haz solo el Dia 1.
2. Temporizador 10 min: repite en voz alta el bloque Decir esto.
3. Anota en bitacora.md una frase dificil y una frase ganada.

## Ritmo recomendado

| Tiempo | Que hacer |
|--------|-----------|
| 15 min/dia | Minimo: frases + voz alta |
| 30 min/dia | Ideal: frases + mini ejercicio + mini audio |
| 1 h, 3x/semana | Repaso + simulacion de mini presentacion |

## Archivos

| Archivo | Contenido |
|---------|-----------|
| semana-01.md ... semana-04.md | Plan dia a dia |
| frases-clave.md | Frases listas para practicar |
| vocabulario-tech.md | Vocabulario Data Analyst |
| cheat-sheet-entrevistas.md | Respuestas cortas para entrevistas |
| ruta-data-interactiva.md | Ruta y fuentes confiables |
| ilustraciones-referenciadas.md | Guia de imagenes seguras |

## Nivel

A2->B1 funcional: entiendes bastante pero te trabas al hablar. El curso prioriza salida (hablar/escribir), no examenes.

## Reglas que funcionan

1. Ingles primero: intenta decirlo antes de traducir.
2. Un bloque por dia: constancia > maraton.
3. En voz alta siempre.
4. Memoriza chunks: "The data shows...", "I can clarify...", "The main insight is...".

## Despues de 4 semanas

- Repasa frases-clave.md una vez por semana.
- Graba 2 min: "What this dataset tells us".
- Practica una mini explicacion de grafica por dia.
