from pydantic import BaseModel, EmailStr
from typing import Optional, List, ForwardRef
from datetime import datetime
from models import TennisLevel, Sex

class UserBase(BaseModel):
    email: EmailStr
    first_name: str
    last_name: str
    date_of_birth: datetime
    sex: Sex
    tennis_level: TennisLevel

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int
    is_active: bool
    created_at: datetime
    profile_image: Optional[str] = None

    class Config:
        from_attributes = True

class EventBase(BaseModel):
    court_location: str
    latitude: float
    longitude: float
    event_date: datetime
    event_time: datetime
    max_participants: Optional[int] = None
    description: Optional[str] = None

class EventCreate(EventBase):
    pass

class Event(EventBase):
    id: int
    is_cancelled: bool
    created_at: datetime
    organizer_id: int
    available_spots: Optional[int] = None

    class Config:
        from_attributes = True

class EventRegistrationBase(BaseModel):
    event_id: int

class EventRegistrationCreate(EventRegistrationBase):
    pass

class EventRegistrationResponse(EventRegistrationBase):
    id: int
    user_id: int
    registration_date: datetime
    user: User
    event: Event

    class Config:
        from_attributes = True

class EventWithRegistrations(Event):
    registrations: List[EventRegistrationResponse] = []

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

class WithdrawalResponse(BaseModel):
    message: str

# Update forward references
EventRegistrationResponse.model_rebuild()
EventWithRegistrations.model_rebuild() 