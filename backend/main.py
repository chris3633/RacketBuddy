from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os
from fastapi.staticfiles import StaticFiles
import httpx
import requests

# Load environment variables
load_dotenv()

# Get environment variables
DATABASE_URL = os.getenv("DATABASE_URL")
SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "30"))
OPENCAGE_API_KEY = os.getenv("OPENCAGE_API_KEY")

# Create FastAPI app
app = FastAPI(
    title="Racket Buddy API",
    description="API for managing tennis match events and user profiles",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for now
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create uploads directory if it doesn't exist
UPLOAD_DIR = "uploads"
if not os.path.exists(UPLOAD_DIR):
    os.makedirs(UPLOAD_DIR)

# Mount the uploads directory
app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")

@app.get("/")
async def root():
    try:
        return {
            "message": "Welcome to Racket Buddy API v1.1",
            "status": "healthy",
            "environment": {
                "database_url": "configured" if DATABASE_URL else "missing",
                "secret_key": "configured" if SECRET_KEY else "missing",
                "algorithm": ALGORITHM,
                "access_token_expire_minutes": ACCESS_TOKEN_EXPIRE_MINUTES
            }
        }
    except Exception as e:
        return {
            "error": str(e),
            "status": "error",
            "environment": {
                "database_url": "configured" if DATABASE_URL else "missing",
                "secret_key": "configured" if SECRET_KEY else "missing",
                "algorithm": ALGORITHM,
                "access_token_expire_minutes": ACCESS_TOKEN_EXPIRE_MINUTES
            }
        }

@app.get("/api/geocode")
async def geocode(query: str):
    """Geocode an address using LocationIQ."""
    if not query:
        return []
        
    try:
        # Create a session with proper headers
        session = requests.Session()
        
        # Make the request to LocationIQ using autocomplete endpoint
        response = session.get(
            'https://us1.locationiq.com/v1/autocomplete',
            params={
                'key': 'pk.a77154f1765f87458c4552e06abea27d',  # LocationIQ API key
                'q': query,
                'format': 'json',
                'limit': 10,
                'addressdetails': 1,
                'dedupe': 1,
                'extratags': 1,
                'namedetails': 1,
                'layer': 'poi,address,venue',  # Focus on points of interest
                'countrycodes': 'us',  # Keep US restriction since Impett Park is in US
                'bounded': 1,  # Enable bounded search
                'normalizeaddress': 0  # Disable address normalization
            },
            headers={
                'Accept': 'application/json'
            },
            timeout=5
        )
        
        print(f"LocationIQ Response Status: {response.status_code}")
        print(f"LocationIQ Response: {response.text}")
        
        if response.status_code == 200:
            results = response.json()
            
            # Format the results
            formatted_results = []
            for result in results:
                address = result.get('address', {})
                display_name = []
                
                # Build a more detailed address
                if result.get('display_name'):
                    display_name = [result['display_name']]
                else:
                    # Fallback to building address components
                    if address.get('name'):
                        display_name.append(address['name'])
                    if address.get('road'):
                        display_name.append(address['road'])
                    if address.get('city'):
                        display_name.append(address['city'])
                    elif address.get('town'):
                        display_name.append(address['town'])
                    elif address.get('village'):
                        display_name.append(address['village'])
                    if address.get('state'):
                        display_name.append(address['state'])
                    if address.get('country'):
                        display_name.append(address['country'])
                
                # If we couldn't build a nice address, use the display_name
                if not display_name:
                    display_name = [result.get('display_name', '')]
                
                formatted_results.append({
                    'display_name': ', '.join(display_name),
                    'lat': result.get('lat', ''),
                    'lon': result.get('lon', '')
                })
            
            return formatted_results
        else:
            print(f"Error from LocationIQ: {response.status_code} - {response.text}")
            return []
            
    except requests.exceptions.RequestException as e:
        print(f"Request error: {str(e)}")
        return []
    except Exception as e:
        print(f"Unexpected error: {str(e)}")
        return []

# Import and include routers
from routers import users, events, auth

app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(users.router, prefix="/api/users", tags=["Users"])
app.include_router(events.router, prefix="/api/events", tags=["Events"])

# For local development
if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port) 