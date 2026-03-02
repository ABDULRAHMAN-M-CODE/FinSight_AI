from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

# DB session dependency
from app.database import get_db

# import needed models for this router
from app.models.registration import User

# Authentication dependency 
from app.core.dependencies import get_current_user

# import needed schemas for this router
from app.schemas.user_settings_schemas import (
    ChangePasswordRequest,
    ChangeNameRequest,
    ChangePhoneNumberRequest,
)

# import needed utils
from app.core.security.security import hash_password, verify_password
from app.core.utils.PWV_utils import validate_password



# User settings router (change name, change password, change phone number).
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