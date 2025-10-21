import sqlite3
import os
from flask import current_app

def get_db_connection():
    """Get database connection"""
    conn = sqlite3.connect('game.db')
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    """Initialize database with schema"""
    conn = get_db_connection()
    
    # Create users table
    conn.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    # Create games table
    conn.execute('''
        CREATE TABLE IF NOT EXISTS games (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            user_score INTEGER NOT NULL,
            computer_score INTEGER NOT NULL,
            result TEXT NOT NULL,
            played_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id)
        )
    ''')
    
    # Create indexes for performance
    conn.execute('CREATE INDEX IF NOT EXISTS idx_games_user_id ON games(user_id)')
    conn.execute('CREATE INDEX IF NOT EXISTS idx_games_result ON games(result)')
    conn.execute('CREATE INDEX IF NOT EXISTS idx_games_user_score ON games(user_score DESC)')
    
    conn.commit()
    conn.close()
