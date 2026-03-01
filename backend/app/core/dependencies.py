from fastapi import Depends, HTTPException, status,Request
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import JWTError, jwt
from sqlalchemy.orm import Session

from app.core.security.jwt import SECRET_KEY, ALGORITHM
from app.models.registration.user import User
from app.database import get_db

bearer_scheme = HTTPBearer()

# to get the user info from the JWT or cookie 
def get_current_user(
    request:Request,
    
    
    db: Session = Depends(get_db)
) -> User:

    
    token=request.cookies.get("access_token")

    if not token:
        raise HTTPException(status_code=401, detail="Not Authinticated")
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("sub")
        if not user_id :
            
            raise HTTPException(status_code=401, detail="Not Authinticated")
    except JWTError:
        
        raise HTTPException(status_code=401, detail="Not Authinticated")
    
    user = db.query(User).filter(User.id == user_id).first()

    if not user:
        
        raise HTTPException(status_code=401, detail="Not Authinticated")
    return user
