# [Racket Buddy](https://racket-buddy.vercel.app/)

A modern web application for organizing and joining weekly tennis matches with friends.

# App Available At: [https://racket-buddy.vercel.app/](https://racket-buddy.vercel.app/)

## Features

- User registration and profile management
- Create and manage tennis match events
- Browse and join available matches
- Responsive design for both mobile and desktop
- Real-time event capacity tracking

## Tech Stack

### Frontend
- React.js
- Tailwind CSS
- React Router
- Axios for API calls

### Backend
- Python FastAPI
- SQLAlchemy ORM
- PostgreSQL Database
- JWT Authentication

## Project Structure

```
racket-buddy/
├── frontend/           # React frontend application
├── backend/           # FastAPI backend application
└── README.md
```

## LOCAL Setup Instructions

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Set up the database:
   ```bash
   python init_db.py
   ```
5. Run the development server:
   ```bash
   uvicorn main:app --reload
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm start
   ```

## Environment Variables

### Backend
Create a `.env` file in the backend directory with:
```
DATABASE_URL=postgresql://user:password@localhost:5432/racketbuddy
SECRET_KEY=your-secret-key
```

### Frontend
Create a `.env` file in the frontend directory with:
```
REACT_APP_API_URL=http://localhost:8000
```

## License

MIT 
