# AI-Powered Personalized Financial Advisor – Backend (version 1.1)

Backend service for an AI-powered personalized financial advisor application.  
Built with **FastAPI**, **PostgreSQL**, and **SQLAlchemy**.

---

## Features

### Authentication
- User registration
- Email verification
- User login
- JWT authentication
- Forgot / reset password

### User Settings
- Change email (requires re-verification)
- Change password
- Change phone number
- Change full name

---

## Tech Stack
- FastAPI
- PostgreSQL
- SQLAlchemy
- JWT Authentication
- Pydantic

---

## Requirements
- Python 3.9+
- PostgreSQL
- Virtual environment (recommended)

---

## Environment Variables

Create a `.env` file in the backend root directory:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/db_name
SECRET_KEY=your_secret_key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
