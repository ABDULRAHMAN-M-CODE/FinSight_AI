from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks,Response
from sqlalchemy.orm import Session

# DB session dependency
from app.database import get_db

# import needed models
from app.models.registration import User, EmailVerificationToken, PasswordResetToken

from datetime import datetime, timedelta

# import needed schemas for this router
from app.schemas.auth_schemas import (
    UserRegister,
    UserLogin,
    VerifyEmailCodeRequest,
    ForgotPasswordRequest,
    ResetPasswordRequest,
)

# import needed utils
from app.core.security.security import (
    hash_password,
    verify_password,
    generate_reset_token,
    generate_raw_token,
    hash_token,
    generate_email_code,
    verify_token,
)
from app.core.security.jwt import create_access_token, ACCESS_TOKEN_EXPIRE_MINUTES
from app.core.utils.email_utils import send_email
from app.core.utils.PWV_utils import validate_password


# Auth router (register, verify email, login, reset password).
router = APIRouter(prefix="/auth")


@router.post("/register")
def register(user: UserRegister, background_tasks: BackgroundTasks, db: Session = Depends(get_db)):

    # check if the two passwords are the same
    if user.password != user.confirm_password:
        raise HTTPException(status_code=400, detail="Passwords do not match")
    # to ensure strong passwords
    validate_password(user.password)

    # check if email is already used .
    existing_user = db.query(User).filter(User.email == user.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    # create a new user 
    new_user = User(
        full_name = user.full_name,
        phone_number = user.phone_number,
        email=user.email,
        password_hash=hash_password(user.password)
    )
    # add user to database
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    raw_token = generate_raw_token()
    hashed_token = hash_token(raw_token)

    # send code to the email of the new user
    code = generate_email_code()

    verification = EmailVerificationToken(
        user_id=new_user.id,
        token_hash=hash_token(code),
        expires_at=datetime.utcnow() + timedelta(minutes=10)
    )

    db.add(verification)
    db.commit()

    background_tasks.add_task(
        send_email,
        to=new_user.email,
        subject="Verify your email",
        body=f"""
    Your verification code is:

    {code}

    This code expires in 10 minutes.
    """
    )

    return {"message": "User registered successfully. Please check your email for verify"}


    
@router.post("/verify-email")
def verify_email(
    data: VerifyEmailCodeRequest,
    response:Response,   
    db: Session = Depends(get_db)
):
    verification = (
        db.query(EmailVerificationToken)
        .filter(
            EmailVerificationToken.verified_at.is_(None),
            EmailVerificationToken.expires_at > datetime.utcnow()
        )
        .first()
    )

    if not verification or not verify_token(data.code, verification.token_hash):
        raise HTTPException(
            status_code=400,
            detail="Invalid or expired verification code"
        )

    user = db.query(User).filter(User.id == verification.user_id).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    user.is_email_verified = True
    user.email_verified_at = datetime.utcnow()
    verification.verified_at = datetime.utcnow()

    db.commit()

    # New Logic Below, frontend assumes that the user is authinticated after verification, this is a valid design choice, and much simpler  
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)

    access_token = create_access_token(
        data={
            "sub": str(user.id),
            "email": user.email,
            "first_login": user.is_first_login
        },
        expires_delta=access_token_expires
    )

    # frontend will store the following cookie so that every future request to the backend will include this cookie/token
    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=True,              # Prevent JS access (protect against XSS "javascript injection" token theft)
        secure=False,               
        samesite="lax",             # Helps protect against CSRF, you can read about it , I do not understand it well .
        # Long age for testing purposes.
        max_age=ACCESS_TOKEN_EXPIRE_MINUTES * 60, 
        path="/"                    # Cookie available to entire app
    )

    return {
        "message": "Email verified successfully",
        "first_login": user.is_first_login
    }


@router.post("/login")
def login(user: UserLogin, response: Response, db: Session = Depends(get_db)):

    db_user = db.query(User).filter(User.email == user.email).first()

    if not db_user or not verify_password(user.password, db_user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid Email or password")

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
    # set the cookie
    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=True,
        secure=False,
        samesite="lax",
        max_age=ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        path="/"
    )

    return {
        "message": "Login successful",
        "first_login": db_user.is_first_login
    }

@router.post("/forgot-password")
def forgot_password(
    data: ForgotPasswordRequest,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.email == data.email).first()

    if user:
        raw_token = generate_reset_token()
        hashed_token = hash_token(raw_token)

        reset_token = PasswordResetToken(
            user_id=user.id,
            token_hash=hashed_token,
            expires_at=datetime.utcnow() + timedelta(minutes=30)
        )

        db.add(reset_token)
        db.commit()

        reset_link = (
            f"http://localhost:5173/setPasswordPage?" 
            f"token={raw_token}"
        )

        background_tasks.add_task(
            send_email,
            to=user.email,
            subject="Reset your password",
            body=f"""
We received a request to reset your password.

Click the link below to reset it:
{reset_link}

This link expires in 30 minutes.

If you did not request this, please ignore this email.
"""
        )

    return {
        "message": "If the email exists, a reset link was sent"
    }


@router.post("/reset-password")
def reset_password(
    data: ResetPasswordRequest,
    db: Session = Depends(get_db)
):
    hashed_token = hash_token(data.token)

    reset_token = (
        db.query(PasswordResetToken)
        .filter(
            PasswordResetToken.token_hash == hashed_token,
            PasswordResetToken.expires_at > datetime.utcnow(),
            PasswordResetToken.used_at.is_(None)
        )
        .first()
    )

    if not reset_token:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired token"
        )

    user = db.query(User).filter(User.id == reset_token.user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # enforce strong password
    validate_password(data.new_password)

    user.password_hash = hash_password(data.new_password)

    # invalidate token
    reset_token.used_at = datetime.utcnow()

    db.commit()

    return {"message": "Password reset successfully"}
