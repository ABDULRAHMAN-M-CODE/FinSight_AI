from datetime import datetime, timedelta
from jose import jwt
from app.core.config import settings

# to create the JWT
SECRET_KEY = settings.SECRET_KEY
ALGORITHM = settings.ALGORITHM

# expire time is 30 mins 
ACCESS_TOKEN_EXPIRE_MINUTES = 30# modified for testing, to prevent the need for repeated singup during testing the app

def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()

    expire = datetime.utcnow() + (
        expires_delta
        if expires_delta
        else timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    )

    to_encode.update({"exp": expire})

    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt
