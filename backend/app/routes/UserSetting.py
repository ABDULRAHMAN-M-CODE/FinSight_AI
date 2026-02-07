from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks
from sqlalchemy.orm import Session
from datetime import datetime, timedelta


from app.database import SessionLocal, get_db    
from app.models.registration import User,EmailVerificationToken 
from app.core.dependencies import get_current_user
from app.security.security import hash_password, verify_password,generate_raw_token,hash_token,token_expiry,generate_email_code
from app.schemas.user import ChangePasswordRequest,ChangeNameRequest,ChangePhoneNumberRequest, ChangeEmailRequest , ConfirmEmailChangeRequest
from app.core.PWV import validate_password
from app.core.email import send_email
from app.models.registration.email_change_token import EmailChangeToken
from app.security.security import verify_token


router = APIRouter(prefix="/UserSettings")

@router.post("/change-email")
def change_email(
    data: ChangeEmailRequest,
    background_tasks: BackgroundTasks,
    current_user: User = Depends(get_current_user), 
    db: Session = Depends(get_db)
):
    user = current_user

    # Check if email already exists
    if db.query(User).filter(User.email == data.new_email).first():
        raise HTTPException(status_code=400, detail="Email already registered")

    # Generate verification code
    code = generate_email_code()

    verification = EmailChangeToken(
        user_id=user.id,
        new_email=data.new_email,
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


@router.post("/confirm-email-change")
def confirm_email_change(
    data: ConfirmEmailChangeRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    verification = (
        db.query(EmailChangeToken)
        .filter(
            EmailChangeToken.new_email == data.new_email,
            EmailChangeToken.user_id == current_user.id,
            EmailChangeToken.used == False,
            EmailChangeToken.expires_at > datetime.utcnow()
        )
        .first()
    )

    if not verification or not verify_token(data.code, verification.token_hash):
        raise HTTPException(
            status_code=400,
            detail="Invalid or expired verification code"
        )
    #  update email 
    current_user.email = data.new_email
    current_user.is_email_verified = True
    current_user.email_verified_at = datetime.utcnow()
    
    db.delete(verification)
    db.commit()
    
    return {"message": "Email updated successfully, Please log in again"}

    
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