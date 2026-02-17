from typing import Optional
from pydantic import BaseModel, EmailStr

# DTO for register
class UserRegister(BaseModel):
    full_name: Optional[str] = None   
    phone_number: Optional[str] = None  
    email: EmailStr
    password: str 
    confirm_password: str 

# DTO for login
class UserLogin(BaseModel):
    email: EmailStr
    password: str

# DTO for forget password endpoint
class ForgotPasswordRequest(BaseModel):
    email: EmailStr

# DTO for resetting the password    
class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str 
    
#DTO for verification
class VerifyEmailCodeRequest(BaseModel):
    code: str
