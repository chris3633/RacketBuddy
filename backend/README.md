# RacketBuddy Backend

A FastAPI backend for the RacketBuddy tennis event management application.

## Features

- User authentication and management
- Tennis event creation and management
- Event registration system
- Location-based event discovery
- Profile management

## Tech Stack

- FastAPI
- SQLAlchemy
- PostgreSQL (Supabase)
- Alembic for database migrations
- Python 3.10+

## Setup

1. Clone the repository:
```bash
git clone [your-repository-url]
cd RacketBuddy/backend
```

2. Create and activate a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Set up environment variables:
Create a `.env` file with:
```
DATABASE_URL=your_supabase_connection_string
```

5. Run database migrations:
```bash
alembic upgrade head
```

6. Start the development server:
```bash
uvicorn main:app --reload
```

## API Documentation

Once the server is running, visit:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## Environment Variables

- `DATABASE_URL`: Supabase PostgreSQL connection string
- Add other environment variables as needed

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request 