
from passlib.context import CryptContext
import secrets
from datetime import datetime, timedelta
import hashlib
import hmac
from core.config import settings

# extra logic to hash passwords and create tokens
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(password: str, hashed: str) -> bool:
    return pwd_context.verify(password, hashed)

def generate_reset_token() -> str:
    return secrets.token_urlsafe(32)

def generate_raw_token():
    return secrets.token_urlsafe(32)

def hash_token(token: str) -> str:
    return hashlib.sha256(token.encode()).hexdigest()

def token_expiry(hours=24):
    return datetime.utcnow() + timedelta(hours=hours)

def generate_email_code():
    return f"{secrets.randbelow(1_000_000):06d}"  # 6 digits

def hash_token(token: str) -> str:
    return hmac.new(
        settings.TOKEN_SECRET.encode(),
        token.encode(),
        hashlib.sha256
    ).hexdigest()

def verify_token(plain_token: str, hashed_token: str) -> bool:
    return hmac.compare_digest(
        hash_token(plain_token),
        hashed_token
    )