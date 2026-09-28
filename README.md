# Chatbot.io

A production-oriented SaaS chatbot workspace with a public marketing site, authenticated workspace, agents, grounded knowledge, conversations, leads, analytics, integrations, deployment widget, and workspace settings.

## Stack

- Frontend: React + TypeScript + Vite + React Router + TanStack Query
- Backend: Node.js + TypeScript + Fastify
- Data: PostgreSQL
- AI: NVIDIA OpenAI-compatible chat endpoint when configured; grounded deterministic fallback for local development
- Deployment: Docker Compose + Nginx reverse proxy

## Local setup

```bash
cp .env.example .env
docker compose up --build
```

Open http://localhost:3000.

The API is available under `/api`. Create an account from the UI, create an agent, add knowledge, test it, customize the widget, and copy the deploy snippet.

## Product boundaries

The marketing site and authenticated workspace are composed separately in the frontend route tree. The browser talks only to the application API; database credentials and AI provider credentials stay server-side.
