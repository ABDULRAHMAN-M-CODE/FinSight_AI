# AI-Powered Personalized Financial Advisor (Stage1 - Backend)

This repository contains the Stage1 backend implementation:
- FastAPI app with async SQLAlchemy models for the database described in Database_description_clean.txt
- Alembic migration for initial DB schema
- Celery + Redis for background simulations
- Docker Compose for local dev

Quick start (development, assuming Docker Desktop installed):

1. Copy `.env.example` to `.env` and fill values.
2. Build and start containers:
   docker compose up --build

3. Inside the `web` container (or from host after dependencies installed), apply alembic migrations:
   docker compose exec web alembic upgrade head

4. Start worker (already configured in docker-compose) and visit API:
   http://localhost:8000/docs

This stage implements:
- /questionnaire/submit
- /simulations/run
- /simulations/history
- /alerts/monitor

See the OpenAPI docs at `/docs` once running.

Notes:
- This stage focuses on the backend. LangGraph & LangChain orchestration will be added in Stage 2.
- Use the `.env` file to set secrets (DATABASE_URL, REDIS_URL, etc.).