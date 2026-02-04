# routes/auth.py
from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks
from sqlalchemy.orm import Session
from database import SessionLocal
from models.registration import User, EmailVerificationToken , PasswordResetToken
from schemas.registration import UserRegister, UserLogin
from core.security import hash_password, verify_password
from datetime import timedelta
from core.jwt import create_access_token, ACCESS_TOKEN_EXPIRE_MINUTES
from schemas.registration import ForgotPasswordRequest
from datetime import datetime, timedelta
from core.security import generate_reset_token
from schemas.registration import ResetPasswordRequest
from core.security import generate_raw_token,hash_token, token_expiry
from core.email import send_email

router = APIRouter(prefix="/auth")

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/register")
def register(user: UserRegister, background_tasks: BackgroundTasks, db: Session = Depends(get_db)):

    if user.password != user.confirm_password:
        raise HTTPException(status_code=400, detail="Passwords do not match")

    existing_user = db.query(User).filter(User.email == user.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    new_user = User(
        email=user.email,
        password_hash=hash_password(user.password)
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    raw_token = generate_raw_token()
    hashed_token = hash_token(raw_token)

    verification_link = f"https://abcd1234.ngrok.io/verify-email?token={raw_token}"
    
    background_tasks.add_task(
        send_email,
        to=new_user.email,
        subject="Verify your email",
        body=f"Click the link to verify your email:\n{verification_link}"
    )

    verification_token = EmailVerificationToken(
        user_id=new_user.id,
        token_hash=hashed_token,
        expires_at=token_expiry()
    )

    db.add(verification_token)
    db.commit()

    return {"message": "User registered successfully. Please check your email for verify"}

@router.get("/verify-email")
def verify_email(token: str, db: Session = Depends(get_db)):

    token_hash = token

    verification = (
        db.query(EmailVerificationToken)
        .filter(
            EmailVerificationToken.token_hash == token_hash,
            EmailVerificationToken.verified_at.is_(None),
            EmailVerificationToken.expires_at > datetime.utcnow()
        )
        .first()
    )

    if not verification:
        raise HTTPException(
            status_code=400,
            detail="Invalid or expired verification token"
        )

    user = db.query(User).filter(User.id == verification.user_id).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    user.is_email_verified = True
    user.email_verified_at = datetime.utcnow()
    verification.verified_at = datetime.utcnow()

    db.commit()

    return {"message": "Email verified successfully"}


@router.post("/login")
def login(user: UserLogin, db: Session = Depends(get_db)):

    db_user = db.query(User).filter(User.email == user.email).first()

    if not db_user or not verify_password(user.password, db_user.password_hash):
        
        raise HTTPException(
             status_code=401,
             detail="Invalid credentials"
        )

    if not db_user.is_email_verified:
        raise HTTPException(
            status_code=403,
            detail="Email not verified"
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)

    access_token = create_access_token(
        data={
            "sub": str(db_user.id),
            "email": db_user.email,
            "first_login": db_user.is_first_login
        },
        expires_delta=access_token_expires
    )

    return {
        "message": "Login successful",
        "access_token": access_token,
        "token_type": "bearer",
        "first_login": db_user.is_first_login
    }

@router.post("/forgot-password")
def forgot_password(
    data: ForgotPasswordRequest,
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.email == data.email).first()

    if user:
        reset_token = generate_reset_token()
        user.reset_token = reset_token
        user.reset_token_expires_at = datetime.utcnow() + timedelta(minutes=30)
        db.commit()

        print("RESET TOKEN (DEV ONLY):", reset_token)

    return {
        "message": "If the email exists, a reset link was sent"
    }

@router.post("/reset-password")
def reset_password(
    data: ResetPasswordRequest,
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.reset_token == data.token).first()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired token"
        )

    if user.reset_token_expires_at < datetime.utcnow():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired token"
        )

    # Update password
    user.password_hash = hash_password(data.new_password)

    # Invalidate token
    user.reset_token = None
    user.reset_token_expires_at = None

    db.commit()

    return {
        "message": "Password reset successfully"
    }
