from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, joinedload
from jose import JWTError, jwt
from typing import List, Union
from datetime import datetime

from database import get_db
import models
import schemas
from routers.auth import oauth2_scheme, get_current_user, SECRET_KEY, ALGORITHM

router = APIRouter()

async def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
        token_data = schemas.TokenData(email=email)
    except JWTError:
        raise credentials_exception
    user = db.query(models.User).filter(models.User.email == token_data.email).first()
    if user is None:
        raise credentials_exception
    return user

@router.post("/", response_model=schemas.EventWithRegistrations)
def create_event(
    event: schemas.EventCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    # Create the event
    db_event = models.Event(
        **event.dict(),
        organizer_id=current_user.id
    )
    db.add(db_event)
    db.commit()
    db.refresh(db_event)
    
    # Automatically register the organizer
    registration = models.EventRegistration(
        event_id=db_event.id,
        user_id=current_user.id
    )
    db.add(registration)
    db.commit()
    
    # Load the event with registrations and user data
    db_event = db.query(models.Event).filter(models.Event.id == db_event.id).first()
    db_event.registrations = db.query(models.EventRegistration).filter(
        models.EventRegistration.event_id == db_event.id
    ).options(
        joinedload(models.EventRegistration.user)
    ).all()
    
    print(f"Created event {db_event.id} with {len(db_event.registrations)} registrations")
    for reg in db_event.registrations:
        print(f"Registration: user_id={reg.user_id}, user={reg.user.email}")
    
    return db_event

@router.get("/", response_model=List[schemas.EventWithRegistrations])
def get_events(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    # Get only non-cancelled events
    events = db.query(models.Event).filter(models.Event.is_cancelled == False).offset(skip).limit(limit).all()
    # Load registrations for each event with user data
    for event in events:
        event.registrations = db.query(models.EventRegistration).filter(
            models.EventRegistration.event_id == event.id
        ).options(
            joinedload(models.EventRegistration.user)
        ).all()
        print(f"Event {event.id} registrations:", [
            {"user_id": reg.user_id, "user": reg.user.email} 
            for reg in event.registrations
        ])
    return events

@router.get("/my-events", response_model=List[schemas.EventWithRegistrations])
def get_my_events(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    events = db.query(models.Event).filter(models.Event.organizer_id == current_user.id).all()
    # Load registrations for each event with user data
    for event in events:
        event.registrations = db.query(models.EventRegistration).filter(
            models.EventRegistration.event_id == event.id
        ).options(
            joinedload(models.EventRegistration.user)
        ).all()
        print(f"Event {event.id} has {len(event.registrations)} registrations")
        for reg in event.registrations:
            print(f"Registration: user_id={reg.user_id}, user={reg.user.email}")
    return events

@router.post("/{event_id}/register", response_model=Union[schemas.EventRegistrationResponse, schemas.WithdrawalResponse])
def register_for_event(
    event_id: int,
    is_withdraw: bool = False,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    event = db.query(models.Event).filter(models.Event.id == event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    
    if event.is_cancelled:
        raise HTTPException(status_code=400, detail="Event is cancelled")
    
    # Find existing registration
    existing_registration = db.query(models.EventRegistration).filter(
        models.EventRegistration.event_id == event_id,
        models.EventRegistration.user_id == current_user.id
    ).first()
    
    if is_withdraw:
        if not existing_registration:
            raise HTTPException(status_code=400, detail="Not registered for this event")
        
        # Delete the registration
        db.delete(existing_registration)
        db.commit()
        
        # Return a success message
        return {"message": "Successfully withdrew from event"}
    
    if existing_registration:
        raise HTTPException(status_code=400, detail="Already registered for this event")
    
    if event.max_participants:
        # Count current registrations
        current_participants = db.query(models.EventRegistration).filter(
            models.EventRegistration.event_id == event_id
        ).count()
        
        # Check if adding one more participant would exceed max_participants
        if current_participants >= event.max_participants:
            raise HTTPException(status_code=400, detail="Event is full")
    
    registration = models.EventRegistration(
        event_id=event_id,
        user_id=current_user.id
    )
    db.add(registration)
    db.commit()
    db.refresh(registration)
    
    # Load the event and user data
    registration = (
        db.query(models.EventRegistration)
        .options(
            joinedload(models.EventRegistration.event),
            joinedload(models.EventRegistration.user)
        )
        .filter(models.EventRegistration.id == registration.id)
        .first()
    )
    
    return registration

@router.delete("/{event_id}")
def cancel_event(
    event_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    # Get the event
    event = db.query(models.Event).filter(models.Event.id == event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    
    # Check if the current user is the organizer
    if event.organizer_id != current_user.id:
        raise HTTPException(
            status_code=403,
            detail="Only the event organizer can cancel this event"
        )
    
    # Check if event is already cancelled
    if event.is_cancelled:
        raise HTTPException(
            status_code=400,
            detail="Event is already cancelled"
        )
    
    # Cancel the event
    event.is_cancelled = True
    db.commit()
    
    return {"message": "Event cancelled successfully"}

@router.get("/my-registrations", response_model=List[schemas.EventRegistrationResponse])
def get_my_registrations(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    print(f"Getting registrations for user {current_user.id}")
    
    # Get registrations with event and user data using a join
    registrations = (
        db.query(models.EventRegistration)
        .options(
            joinedload(models.EventRegistration.event),
            joinedload(models.EventRegistration.user)
        )
        .filter(models.EventRegistration.user_id == current_user.id)
        .all()
    )
    
    # Load registrations for each event and calculate available spots
    for registration in registrations:
        if registration.event:
            # Get all registrations for this event
            event_registrations = db.query(models.EventRegistration).filter(
                models.EventRegistration.event_id == registration.event.id
            ).options(
                joinedload(models.EventRegistration.user)
            ).all()
            
            # Update the event's registrations
            registration.event.registrations = event_registrations
            
            # Calculate available spots
            if registration.event.max_participants:
                current_participants = len(event_registrations)
                registration.event.available_spots = max(0, registration.event.max_participants - current_participants)
            else:
                registration.event.available_spots = None
    
    return registrations

@router.delete("/registrations/{registration_id}")
def cancel_registration(
    registration_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    # Get the registration
    registration = db.query(models.EventRegistration).filter(
        models.EventRegistration.id == registration_id
    ).first()
    
    if not registration:
        raise HTTPException(status_code=404, detail="Registration not found")
    
    # Check if the current user is the one who registered
    if registration.user_id != current_user.id:
        raise HTTPException(
            status_code=403,
            detail="You can only cancel your own registrations"
        )
    
    # Check if the event is in the past
    event = registration.event
    event_date = event.event_date
    if isinstance(event_date, str):
        event_date = datetime.fromisoformat(event_date.replace('Z', '+00:00'))
    if event_date < datetime.now():
        raise HTTPException(
            status_code=400,
            detail="Cannot cancel registration for a past event"
        )
    
    # Delete the registration
    db.delete(registration)
    db.commit()
    
    return {"message": "Registration cancelled successfully"} 