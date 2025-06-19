from sqlalchemy.orm import Session
from database import SessionLocal
import models
from datetime import datetime

def fix_missing_organizer_registrations():
    db = SessionLocal()
    try:
        # Get all events
        events = db.query(models.Event).all()
        print(f"Found {len(events)} events")
        
        for event in events:
            # Check if organizer is registered
            existing_registration = db.query(models.EventRegistration).filter(
                models.EventRegistration.event_id == event.id,
                models.EventRegistration.user_id == event.organizer_id
            ).first()
            
            if not existing_registration:
                print(f"Creating missing registration for event {event.id} (organizer: {event.organizer_id})")
                # Create registration for organizer
                registration = models.EventRegistration(
                    event_id=event.id,
                    user_id=event.organizer_id,
                    registration_date=datetime.utcnow()
                )
                db.add(registration)
            else:
                print(f"Event {event.id} already has organizer registration")
        
        db.commit()
        print("Finished fixing registrations")
        
    except Exception as e:
        print(f"Error: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    fix_missing_organizer_registrations() 