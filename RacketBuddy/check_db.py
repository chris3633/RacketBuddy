from sqlalchemy.orm import Session
from database import SessionLocal
import models
from datetime import datetime

def check_and_fix_database():
    db = SessionLocal()
    try:
        # Get all events
        events = db.query(models.Event).all()
        print(f"\nFound {len(events)} events:")
        
        for event in events:
            print(f"\nEvent {event.id}:")
            print(f"  Location: {event.court_location}")
            print(f"  Organizer ID: {event.organizer_id}")
            print(f"  Max Participants: {event.max_participants}")
            
            # Get all registrations for this event
            registrations = db.query(models.EventRegistration).filter(
                models.EventRegistration.event_id == event.id
            ).all()
            
            print(f"  Found {len(registrations)} registrations:")
            for reg in registrations:
                user = db.query(models.User).filter(models.User.id == reg.user_id).first()
                print(f"    - Registration ID: {reg.id}")
                print(f"      User ID: {reg.user_id}")
                print(f"      User Email: {user.email if user else 'Unknown'}")
                print(f"      Registration Date: {reg.registration_date}")
            
            # Check if organizer is registered
            organizer_registration = db.query(models.EventRegistration).filter(
                models.EventRegistration.event_id == event.id,
                models.EventRegistration.user_id == event.organizer_id
            ).first()
            
            if not organizer_registration:
                print(f"  Creating missing organizer registration for event {event.id}")
                registration = models.EventRegistration(
                    event_id=event.id,
                    user_id=event.organizer_id,
                    registration_date=datetime.utcnow()
                )
                db.add(registration)
                db.commit()
                print("  Registration created successfully")
            else:
                print(f"  Organizer is already registered (Registration ID: {organizer_registration.id})")
        
        print("\nDatabase check complete")
        
    except Exception as e:
        print(f"Error: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    check_and_fix_database() 