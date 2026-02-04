from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks
from sqlalchemy.orm import Session
from datetime import datetime, timedelta


from app.database import SessionLocal, get_db    
from app.models.registration import User,EmailVerificationToken 
from app.core.dependencies import get_current_user
from app.security.security import hash_password, verify_password,generate_raw_token,hash_token,token_expiry,generate_email_code
from app.schemas.user import ChangePasswordRequest,ChangeNameRequest,ChangePhoneNumberRequest, ChangeEmailRequest
from app.core.PWV import validate_password
from app.core.email import send_email



router = APIRouter(prefix="/UserSettings")

@router.post("/change-email")
def change_email(
    data: ChangeEmailRequest,
    background_tasks: BackgroundTasks,
    payload: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    user_id = payload.get("sub")

    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Check if email already exists
    if db.query(User).filter(User.email == data.new_email).first():
        raise HTTPException(status_code=400, detail="Email already registered")

    # Store email temporarily
    user.is_email_verified = False

    # Generate verification code
    code = generate_email_code()   

    verification = EmailVerificationToken(
        user_id=user.id,
        token_hash=hash_token(code),
        expires_at=datetime.utcnow() + timedelta(minutes=10)
    )

    db.add(verification)
    db.commit()

    # Send code email
    background_tasks.add_task(
        send_email,
        to=data.new_email,
        subject="Verify your new email",
        body=f"""
Your verification code is:

{code}

This code expires in 10 minutes.
"""
    )

    return {
        "message": "Verification code sent to new email"
    }


    


@router.post("/change-password")
def change_password(
    data: ChangePasswordRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # 1. Verify old password
    if not verify_password(data.old_password, current_user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Old password is incorrect"
        )

    # 2. Prevent reuse 
    if verify_password(data.new_password, current_user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="New password must be different"
        )
    # 3. ensure strong password is used
    validate_password(data.new_password)
    
    # 4. Update password
    current_user.password_hash = hash_password(data.new_password)

    db.commit()

    return {
        "message": "Password updated successfully"
    }

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