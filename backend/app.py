from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from config import Config
from database.db import init_db
from routes.auth import auth_bp
from routes.game import game_bp
from routes.leaderboard import leaderboard_bp

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    
    # Initialize extensions
    CORS(app, origins=Config.CORS_ORIGINS)
    JWTManager(app)
    
    # Initialize database
    init_db()
    
    # Register blueprints
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(game_bp, url_prefix='/api/game')
    app.register_blueprint(leaderboard_bp, url_prefix='/api/leaderboard')
    
    @app.route('/')
    def health_check():
        return {'message': 'Ping Pong Game API is running'}
    
    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True, port=5000)
