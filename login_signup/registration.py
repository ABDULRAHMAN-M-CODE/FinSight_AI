from pydantic import BaseModel, EmailStr, Field
# DTO for Register
class UserRegister(BaseModel):
    full_name: str
    phone_number : str
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
