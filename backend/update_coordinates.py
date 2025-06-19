from sqlalchemy import create_engine, text
import os
from dotenv import load_dotenv

load_dotenv()

# Use the same DATABASE_URL as in your database.py
SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://user:password@localhost:5432/racketbuddy")

engine = create_engine(SQLALCHEMY_DATABASE_URL)

# SQL command to update NULL latitude and longitude to central US coordinates
update_sql = text("""
    UPDATE events
    SET latitude = 39.8283, longitude = -98.5795
    WHERE latitude IS NULL OR longitude IS NULL
""")

with engine.connect() as conn:
    conn.execute(update_sql)
    conn.commit()

print("Updated NULL latitude and longitude values to central US coordinates (39.8283, -98.5795).") 