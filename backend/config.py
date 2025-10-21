import os
from datetime import timedelta

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'dev-secret-key-change-in-production'
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY') or 'jwt-secret-string'
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=1)
    DATABASE_URL = os.environ.get('DATABASE_URL') or 'sqlite:///game.db'
    CORS_ORIGINS = ['http://localhost:3000']
