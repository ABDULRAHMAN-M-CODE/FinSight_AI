# answering why is more important to me that answering 'what', I want to know the first prinicples explicitly , I want to know the problem, and the solution, and how to the syntax relate to the solution, I must know all the syntax
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from app.core.config import settings
engine = create_engine(settings.DATABASE_URL) 
SessionLocal = sessionmaker(bind=engine) 
Base = declarative_base()  # classes inherits Base are registered inside gloable system of SQL alchemy
def get_db():
    db = SessionLocal() 
    try:
        yield db        
    finally:
        db.close()