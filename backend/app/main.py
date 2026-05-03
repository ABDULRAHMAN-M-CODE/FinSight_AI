# with those three imports, langchain's agent will be able to access the key that is inside the .env file 
import os
from dotenv import load_dotenv
load_dotenv() # loads the .env file

#fastapi packages -----------------------------------------------------
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import Base, engine

# routers -------------------------------------------------------
from app.routes.auth import router as auth_router
from app.routes.user_settings import router as user_settings_router
from app.routes.questionnaire import router as questionnaire_router 
from app.routes.dashboard import router as dashboard_router
from app.routes.ticker import router as ticker_router
# -------------------------------------------------------

# import limiter -------------------------------------------------------
from app.core.security.limiter import init_limiter
# -------------------------------------------------------

# Create the tables in the database
Base.metadata.create_all(bind=engine)

app = FastAPI(title="FinSight_AI")

# Initialize SlowAPI limiter
init_limiter(app)

# Create middleware to allow access for frontend
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
app.include_router(dashboard_router)
app.include_router(ticker_router)

# main endpoint
@app.get("/")
def home():
    return {"status": "success", "message": "FinSight AI API is running!"}