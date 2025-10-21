import sqlite3
from database.db import get_db_connection

class Game:
    def __init__(self, id=None, user_id=None, user_score=None, computer_score=None, result=None, played_at=None):
        self.id = id
        self.user_id = user_id
        self.user_score = user_score
        self.computer_score = computer_score
        self.result = result
        self.played_at = played_at
    
    @staticmethod
    def create(user_id, user_score, computer_score, result):
        """Create a new game record"""
        conn = get_db_connection()
        try:
            cursor = conn.execute(
                'INSERT INTO games (user_id, user_score, computer_score, result) VALUES (?, ?, ?, ?)',
                (user_id, user_score, computer_score, result)
            )
            conn.commit()
            return cursor.lastrowid
        finally:
            conn.close()
    
    @staticmethod
    def get_user_games(user_id):
        """Get all games for a user"""
        conn = get_db_connection()
        try:
            games = conn.execute(
                'SELECT * FROM games WHERE user_id = ? ORDER BY played_at DESC',
                (user_id,)
            ).fetchall()
            return [dict(game) for game in games]
        finally:
            conn.close()
    
    @staticmethod
    def get_user_stats(user_id):
        """Get user's personal best and total games"""
        conn = get_db_connection()
        try:
            stats = conn.execute(
                '''SELECT 
                    MAX(user_score) as personal_best,
                    COUNT(*) as total_games
                   FROM games 
                   WHERE user_id = ?''',
                (user_id,)
            ).fetchone()
            return {
                'personal_best': stats['personal_best'] or 0,
                'total_games': stats['total_games'] or 0
            }
        finally:
            conn.close()
    
    @staticmethod
    def get_top_players(limit=5):
        """Get top players by highest score"""
        conn = get_db_connection()
        try:
            top_players = conn.execute(
                '''SELECT u.username, MAX(g.user_score) as highest_score
                   FROM users u
                   JOIN games g ON u.id = g.user_id
                   GROUP BY u.id, u.username
                   ORDER BY highest_score DESC
                   LIMIT ?''',
                (limit,)
            ).fetchall()
            return [dict(player) for player in top_players]
        finally:
            conn.close()
