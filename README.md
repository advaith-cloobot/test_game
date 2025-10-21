# Ping Pong Game Application

A full-stack ping pong game built with React frontend, Python Flask backend, and SQLite database.

## Features

- **User Authentication**: Login and signup with JWT tokens
- **Ping Pong Game**: Play against AI opponent with canvas-based rendering
- **Game Controls**: Start, pause, resume, restart, and quit functionality
- **Leaderboard**: Top 5 players and personal statistics
- **Responsive Design**: Works on desktop and mobile devices

## Technology Stack

### Backend
- Python 3.8+
- Flask (Web framework)
- Flask-CORS (Cross-origin resource sharing)
- Flask-JWT-Extended (JWT authentication)
- SQLite3 (Database)

### Frontend
- React 18+
- React Router (Navigation)
- Axios (HTTP client)
- HTML5 Canvas (Game rendering)

## Project Structure

```
test_game/
├── backend/
│   ├── app.py                 # Main Flask application
│   ├── config.py              # Configuration settings
│   ├── requirements.txt       # Python dependencies
│   ├── models/               # Database models
│   ├── routes/               # API routes
│   ├── database/              # Database utilities
│   └── game.db               # SQLite database (created at runtime)
├── frontend/
│   ├── src/
│   │   ├── components/        # React components
│   │   ├── services/          # API services
│   │   ├── utils/            # Game logic utilities
│   │   └── App.js            # Main app component
│   └── package.json
└── README.md
```

## Setup Instructions

### Prerequisites
- Python 3.8 or higher
- Node.js 16 or higher
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create a virtual environment (recommended):
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Run the Flask application:
   ```bash
   python app.py
   ```

   The backend will be available at `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install Node.js dependencies:
   ```bash
   npm install
   ```

3. Start the React development server:
   ```bash
   npm start
   ```

   The frontend will be available at `http://localhost:3000`

## Usage

1. **Start the Application**:
   - Start the backend server (port 5000)
   - Start the frontend server (port 3000)
   - Open `http://localhost:3000` in your browser

2. **Authentication**:
   - Create a new account using the signup page
   - Or login with existing credentials

3. **Play the Game**:
   - Click "Start Game" on the home page
   - Use mouse movement or arrow keys to control your paddle
   - First to 3 points wins!

4. **View Leaderboard**:
   - Check the leaderboard to see top players
   - View your personal statistics

## Game Controls

- **Mouse**: Move mouse up/down to control your paddle
- **Keyboard**: Use arrow keys (↑/↓) to control your paddle
- **Game Controls**:
  - Start: Begin the game
  - Pause: Pause the current game
  - Resume: Continue from pause
  - Restart: Reset scores to 0-0
  - Quit: Return to home page

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user info

### Game
- `POST /api/game/save` - Save completed game
- `GET /api/game/user/:userId` - Get user's game history

### Leaderboard
- `GET /api/leaderboard/top5` - Get top 5 players
- `GET /api/leaderboard/user/:userId` - Get user statistics

## Database Schema

### Users Table
- `id` (Primary Key)
- `username` (Unique)
- `email` (Unique)
- `password`
- `created_at`

### Games Table
- `id` (Primary Key)
- `user_id` (Foreign Key)
- `user_score`
- `computer_score`
- `result` (win/loss)
- `played_at`

## Development

### Backend Development
- The Flask app runs in debug mode by default
- Database is automatically initialized on first run
- CORS is configured for development

### Frontend Development
- React app uses hot reloading
- All API calls are configured for localhost:5000
- JWT tokens are stored in localStorage

## Deployment

### Production Considerations
- Use environment variables for sensitive configuration
- Use a production WSGI server (Gunicorn/uWSGI)
- Build React app for production (`npm run build`)
- Use a reverse proxy (Nginx) for production
- Consider using PostgreSQL for production database

## Troubleshooting

### Common Issues
1. **CORS Errors**: Ensure backend is running on port 5000
2. **Database Errors**: Check if SQLite database file is created
3. **Authentication Issues**: Clear localStorage and try again
4. **Game Not Loading**: Check browser console for JavaScript errors

### Debug Mode
- Backend: Set `debug=True` in app.py
- Frontend: Use browser developer tools
- Check network tab for API call failures

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the MIT License.