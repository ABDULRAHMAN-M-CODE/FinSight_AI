# main.py
from fastapi import FastAPI
from routes.auth import router as auth_router
from routes.UserSetting import router as user_settings_router
from database import Base, engine
from fastapi.middleware.cors import CORSMiddleware
# to create the database in postgreSQL
Base.metadata.create_all(bind=engine)

# main fastapi object
app = FastAPI(title="FinSight_AI")

# To allow the frontend port to hit on the backend port
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"]
)
# to include the endpoints
app.include_router(auth_router)
app.include_router(user_settings_router)

