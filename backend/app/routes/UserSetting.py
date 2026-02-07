from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks
from sqlalchemy.orm import Session
from datetime import datetime, timedelta

from app.database import SessionLocal, get_db    
from app.models.registration import User,EmailVerificationToken 
from app.core.dependencies import get_current_user
from app.security.security import hash_password, verify_password,generate_raw_token,hash_token,token_expiry,generate_email_code
from app.schemas.user import ChangePasswordRequest,ChangeNameRequest,ChangePhoneNumberRequest
from app.core.PWV import validate_password
from app.core.email import send_email
from app.models.registration.email_change_token import EmailChangeToken
from app.security.security import verify_token


router = APIRouter(prefix="/UserSettings")


@router.post("/change-password")
def change_password(
    data: ChangePasswordRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    #  Verify old password
    if not verify_password(data.old_password, current_user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Old password is incorrect"
        )

    #  Check new password and confirm
    if data.new_password != data.confirm_password:
        raise HTTPException(status_code=400, detail="New passwords do not match")

    #  Validate new password strength
    validate_password(data.new_password)

    #  Update password
    current_user.password_hash = hash_password(data.new_password) 
    db.commit()

    return {"message": "Password changed successfully. Please log in again."}

@router.post("/change-name")
def change_name(
    data: ChangeNameRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # change the old name
    current_user.full_name = data.new_name
    db.commit()

    return {
        "message": "Full name changed successfully"
    }

@router.post("/change-phoneNumber")
def change_phone(
    data: ChangePhoneNumberRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # change the old phone number
    current_user.phone_number = data.new_number

    db.commit()

    return {
        "message": "phone number changed successfully"
    }