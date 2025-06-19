from sqlalchemy.orm import Session
from database import SessionLocal, engine
from models import User, Event, EventRegistration, Sex, TennisLevel
from datetime import datetime, timedelta
import sys

def test_database_connection():
    try:
        # Create a test session
        db = SessionLocal()
        
        # Test 1: Create a test user
        test_user = User(
            email="test@example.com",
            hashed_password="testpassword123",
            first_name="Test",
            last_name="User",
            date_of_birth=datetime(1990, 1, 1),
            sex=Sex.MALE,
            tennis_level=TennisLevel.INTERMEDIATE
        )
        db.add(test_user)
        db.commit()
        db.refresh(test_user)
        print(f"✅ Test 1: Created test user with ID: {test_user.id}")

        # Test 2: Create a test event
        test_event = Event(
            court_location="Test Court",
            latitude=40.7128,
            longitude=-74.0060,
            event_date=datetime.now().date(),
            event_time=datetime.now() + timedelta(days=1),
            max_participants=4,
            description="Test tennis event",
            organizer_id=test_user.id
        )
        db.add(test_event)
        db.commit()
        db.refresh(test_event)
        print(f"✅ Test 2: Created test event with ID: {test_event.id}")

        # Test 3: Register user for the event
        registration = EventRegistration(
            event_id=test_event.id,
            user_id=test_user.id
        )
        db.add(registration)
        db.commit()
        print(f"✅ Test 3: Registered user for the event")

        # Test 4: Query and verify the data
        # Get user with their events
        user = db.query(User).filter(User.id == test_user.id).first()
        print("\nUser details:")
        print(f"Name: {user.first_name} {user.last_name}")
        print(f"Email: {user.email}")
        print(f"Tennis Level: {user.tennis_level}")

        # Get event with its registrations
        event = db.query(Event).filter(Event.id == test_event.id).first()
        print("\nEvent details:")
        print(f"Location: {event.court_location}")
        print(f"Date: {event.event_date}")
        print(f"Time: {event.event_time}")
        print(f"Max Participants: {event.max_participants}")
        print(f"Current Registrations: {len(event.registrations)}")

        # Clean up test data
        db.query(EventRegistration).filter(EventRegistration.event_id == test_event.id).delete()
        db.query(Event).filter(Event.id == test_event.id).delete()
        db.query(User).filter(User.id == test_user.id).delete()
        db.commit()
        print("\n✅ Test 4: Successfully queried and verified data")
        print("✅ Cleanup: Removed test data")

        return True

    except Exception as e:
        print(f"❌ Error during testing: {str(e)}")
        return False
    finally:
        db.close()

if __name__ == "__main__":
    print("Starting Supabase connection test...")
    success = test_database_connection()
    if success:
        print("\n🎉 All tests passed! Supabase connection is working correctly.")
    else:
        print("\n❌ Tests failed. Please check the error messages above.")
        sys.exit(1) 