# Runbook — AI-Powered Personalized Financial Advisor

This runbook describes how to run, deploy, and diagnose the system.

Prerequisites
- Docker and docker-compose for local dev
- Access to a PostgreSQL server and Redis (docker compose provides these for local dev)
- An OpenAI API key (set in .env as OPENAI_API_KEY)
- LangSmith API key (optional) for tracing (set LANGSMITH_API_KEY in .env)

Quick local run (development)
1. Copy `.env.example` to `.env` and fill values including OPENAI_API_KEY and LANGSMITH_API_KEY (local only)
2. Build and run:
   docker compose up --build
3. Run migrations:
   docker compose exec web alembic upgrade head
4. Seed sample data:
   docker compose exec web python scripts/seed_data.py
5. Visit API docs:
   http://localhost:8000/docs

Monitoring and logs
- Web logs:
  docker compose logs -f web
- Worker logs:
  docker compose logs -f worker
- Beat logs:
  docker compose logs -f beat
- DB:
  docker compose exec db psql -U postgres -d finadvisor

Emergency rollback
- Pull a previous image or checkout prior git commit and deploy with docker-compose.prod.yml using your prior image tag.

Secrets and rotation
- Use a secret manager in production (AWS Secrets Manager, Vault).
- Never store secrets in the repository or CI logs.
- Rotate OPENAI/LANGSMITH keys on compromise and update .env / secret stores.

Scaling
- Use Kubernetes manifests (k8s/) to deploy to a cluster.
- Configure HPA (k8s/hpa.yaml) and cluster autoscaling in the cloud provider.

Contact & escalation
- Developer / Maintainer: <your name>
- On-call escalation: follow your organization's escalation policy.