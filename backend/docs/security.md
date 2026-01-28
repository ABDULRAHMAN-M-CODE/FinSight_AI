# Security Checklist

1. Secrets management
   - Store DATABASE_URL, OPENAI_API_KEY, LANGSMITH_API_KEY, and any Docker registry credentials in a secret manager.
   - Do not store .env in the repository. Add `.env` to `.gitignore`.

2. Network & encryption
   - Use TLS for all external endpoints.
   - Use managed Postgres with TLS enabled, and enforce SSL connections (require SSL in DB config).
   - Ensure Redis is not exposed publicly; use private network or VPC.

3. Authentication & authorization
   - Implement user authentication (not included in Stage4 by default). Use OAuth2 / JWT with secure key rotation.
   - Enforce role-based access for admin endpoints.

4. Rate limiting & DDoS protection
   - Add rate limiting at API gateway / load balancer level.
   - Implement per-user throttling for heavy endpoints.

5. Input validation & LLM output safety
   - All user inputs are validated server-side (we already provide QuestionnaireJSON2, etc.)
   - Sanitize and validate LLM JSON outputs before persisting to DB.

6. Auditing & logging
   - Keep audit log for simulation checkpoint persistence and advice write operations.
   - Send logs to a centralized logging service and configure retention.

7. Monitoring & alerting
   - Monitor Celery task failures, queue lengths, and worker memory usage.
   - Set alerts for repeated task failures or DB connection issues.

8. CI/CD safety
   - Use repository secrets for deployment credentials in GitHub Actions.
   - Require PR approvals before merging to main and before production deploys.

9. Third-party dependencies
   - Keep dependencies updated and run vulnerability scans.
   - Pin to known-good versions and run `pip-audit` in CI.

10. Penetration testing & compliance
   - Run security scans and penetration tests prior to major releases.