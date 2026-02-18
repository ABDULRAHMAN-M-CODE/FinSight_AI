# with those three imports, langchain's agent will be able to access the key that is inside the .env file 
import os
from dotenv import load_dotenv
load_dotenv() # loads the .env file

# import fastapi packages -----------------------------------------------------
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import Base, engine

# import database models (table models) -------------------------------------------------
from app.models.registration import user, email_verification_token, password_reset_token
from app.models import goal, investment_account, user_financial_data, debts_advices, protection_advices
# import routers -------------------------------------------------------
from app.routes.auth import router as auth_router
from app.routes.user_settings import router as user_settings_router
from app.routes.questionnaire import router as questionnaire_router 
from app.routes.demo import router as demo_router
# -------------------------------------------------------

# Create the tables in the database
Base.metadata.create_all(bind=engine)

app = FastAPI(title="FinSight_AI")

# Create middlerware to allow access for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Add routes (endpoints)
app.include_router(auth_router)
app.include_router(user_settings_router)
app.include_router(questionnaire_router)
app.include_router(demo_router)

# main endpoint
@app.get("/")
def home():
    return {"status": "success", "message": "FinSight AI API is running!"}