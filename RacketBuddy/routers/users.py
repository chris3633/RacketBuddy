import os
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime

from database import get_db
import models
import schemas
from routers.auth import oauth2_scheme, get_current_user

router = APIRouter()

UPLOAD_DIR = "uploads"
if not os.path.exists(UPLOAD_DIR):
    os.makedirs(UPLOAD_DIR)

@router.get("/me", response_model=schemas.User)
def read_users_me(current_user: models.User = Depends(get_current_user)):
    return current_user

@router.put("/me", response_model=schemas.User)
async def update_user(
    first_name: Optional[str] = None,
    last_name: Optional[str] = None,
    tennis_level: Optional[models.TennisLevel] = None,
    profile_image: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    # Update text fields
    if first_name is not None:
        current_user.first_name = first_name
    if last_name is not None:
        current_user.last_name = last_name
    if tennis_level is not None:
        current_user.tennis_level = tennis_level

    # Handle profile image upload
    if profile_image is not None:
        # Delete old image if exists
        if current_user.profile_image:
            old_image_path = os.path.join(UPLOAD_DIR, current_user.profile_image)
            if os.path.exists(old_image_path):
                os.remove(old_image_path)

        # Save new image
        file_extension = os.path.splitext(profile_image.filename)[1]
        new_filename = f"profile_{current_user.id}_{datetime.utcnow().timestamp()}{file_extension}"
        file_path = os.path.join(UPLOAD_DIR, new_filename)
        
        with open(file_path, "wb") as buffer:
            content = await profile_image.read()
            buffer.write(content)
        
        current_user.profile_image = new_filename

    db.commit()
    db.refresh(current_user)
    return current_user

@router.get("/me/events", response_model=List[schemas.Event])
def get_user_events(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    # Get events where user is registered
    registrations = db.query(models.EventRegistration).filter(
        models.EventRegistration.user_id == current_user.id
    ).all()
    
    event_ids = [reg.event_id for reg in registrations]
    events = db.query(models.Event).filter(models.Event.id.in_(event_ids)).all()
    
    return events 