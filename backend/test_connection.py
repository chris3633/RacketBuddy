from sqlalchemy import create_engine, text
import os
from dotenv import load_dotenv

load_dotenv()

def test_connection():
    try:
        # Use the direct connection string
        database_url = "postgresql://postgres.wsupoyywmrcyrhobrtzt:Stevejobs98!@aws-0-us-east-2.pooler.supabase.com:6543/postgres"
        print(f"Attempting to connect to: {database_url}")
        
        # Create engine
        engine = create_engine(database_url)
        
        # Test connection
        with engine.connect() as connection:
            result = connection.execute(text("SELECT 1"))
            print("✅ Successfully connected to the database!")
            return True
            
    except Exception as e:
        print(f"❌ Error connecting to database: {str(e)}")
        return False

if __name__ == "__main__":
    print("Testing database connection...")
    test_connection() 