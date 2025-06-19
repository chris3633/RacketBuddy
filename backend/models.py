from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, DateTime, Enum, Float
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base
import enum
from datetime import datetime

class TennisLevel(str, enum.Enum):
    BEGINNER = "beginner"
    INTERMEDIATE = "intermediate"
    ADVANCED = "advanced"

class Sex(str, enum.Enum):
    MALE = "male"
    FEMALE = "female"
    OTHER = "other"

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    first_name = Column(String)
    last_name = Column(String)
    date_of_birth = Column(DateTime)
    sex = Column(Enum(Sex))
    tennis_level = Column(Enum(TennisLevel))
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    profile_image = Column(String, nullable=True)  # Store the path to the image

    # Relationships
    created_events = relationship("Event", back_populates="organizer")
    event_registrations = relationship("EventRegistration", back_populates="user")

class Event(Base):
    __tablename__ = "events"

    id = Column(Integer, primary_key=True, index=True)
    court_location = Column(String)
    latitude = Column(Float)
    longitude = Column(Float)
    event_date = Column(DateTime)
    event_time = Column(DateTime)
    max_participants = Column(Integer, nullable=True)
    description = Column(String, nullable=True)
    is_cancelled = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    organizer_id = Column(Integer, ForeignKey("users.id"))

    # Relationships
    organizer = relationship("User", back_populates="created_events")
    registrations = relationship("EventRegistration", back_populates="event")

class EventRegistration(Base):
    __tablename__ = "event_registrations"

    id = Column(Integer, primary_key=True, index=True)
    event_id = Column(Integer, ForeignKey("events.id"))
    user_id = Column(Integer, ForeignKey("users.id"))
    registration_date = Column(DateTime, default=datetime.utcnow)

    # Relationships
    event = relationship("Event", back_populates="registrations")
    user = relationship("User", back_populates="event_registrations") 