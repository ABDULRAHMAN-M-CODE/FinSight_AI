
from pydantic import BaseModel, Field
# DTOs for user settings

class ChangeEmailRequest(BaseModel):
    new_email: str = Field(..., max_length=255)

class ConfirmEmailChangeRequest(BaseModel):
    code: str
    new_email: str

class ChangePasswordRequest(BaseModel):
    old_password: str
    new_password: str
    confirm_password: str

class ChangePhoneNumberRequest(BaseModel):
    new_number: str = Field(..., max_length=20)

class ChangeNameRequest(BaseModel):
    new_name: str = Field(..., max_length=255)
