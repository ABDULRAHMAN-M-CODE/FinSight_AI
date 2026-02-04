from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import Base, engine

# --- CRITICAL: Import models so SQLAlchemy sees them ---
from app.models.registration import user, email_verification_token, password_reset_token
# -------------------------------------------------------

from app.routes.auth import router as auth_router
from app.routes.UserSetting import router as user_settings_router

# Create the tables in the database
Base.metadata.create_all(bind=engine)

app = FastAPI(title="FinSight_AI")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(user_settings_router)