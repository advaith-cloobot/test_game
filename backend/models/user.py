import sqlite3
from database.db import get_db_connection

class User:
    def __init__(self, id=None, username=None, email=None, password=None, created_at=None):
        self.id = id
        self.username = username
        self.email = email
        self.password = password
        self.created_at = created_at
    
    @staticmethod
    def create(username, email, password):
        """Create a new user"""
        conn = get_db_connection()
        try:
            cursor = conn.execute(
                'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
                (username, email, password)
            )
            conn.commit()
            return cursor.lastrowid
        except sqlite3.IntegrityError as e:
            if 'UNIQUE constraint failed: users.username' in str(e):
                raise ValueError("Username already exists")
            elif 'UNIQUE constraint failed: users.email' in str(e):
                raise ValueError("Email already exists")
            else:
                raise e
        finally:
            conn.close()
    
    @staticmethod
    def find_by_username(username):
        """Find user by username"""
        conn = get_db_connection()
        try:
            user = conn.execute(
                'SELECT * FROM users WHERE username = ?', (username,)
            ).fetchone()
            if user:
                return User(
                    id=user['id'],
                    username=user['username'],
                    email=user['email'],
                    password=user['password'],
                    created_at=user['created_at']
                )
            return None
        finally:
            conn.close()
    
    @staticmethod
    def find_by_id(user_id):
        """Find user by ID"""
        conn = get_db_connection()
        try:
            user = conn.execute(
                'SELECT * FROM users WHERE id = ?', (user_id,)
            ).fetchone()
            if user:
                return User(
                    id=user['id'],
                    username=user['username'],
                    email=user['email'],
                    password=user['password'],
                    created_at=user['created_at']
                )
            return None
        finally:
            conn.close()
