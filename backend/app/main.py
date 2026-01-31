import uvicorn
from fastapi import FastAPI
from app.config import settings
from app.routers import questionnaire, simulations, alerts

app = FastAPI(
    title="AI-Powered Personalized Financial Advisor - Backend (Stage1)",
    version="0.1.0",
    description="FastAPI backend for questionnaire, simulations, and alerts (development)."
)

# Include routers
app.include_router(questionnaire.router, prefix="/questionnaire", tags=["questionnaire"])
app.include_router(simulations.router, prefix="/simulations", tags=["simulations"])
app.include_router(alerts.router, prefix="/alerts", tags=["alerts"])

@app.get("/health", tags=["health"])
async def health():
    return {"status": "ok"}

if __name__ == "__main__":
    uvicorn.run("app.main:app", host=settings.HOST, port=settings.PORT, reload=True)

