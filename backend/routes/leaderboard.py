from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.game import Game

leaderboard_bp = Blueprint('leaderboard', __name__)

@leaderboard_bp.route('/top5', methods=['GET'])
def get_top5():
    try:
        top_players = Game.get_top_players(5)
        return jsonify({'top_players': top_players}), 200
    except Exception as e:
        return jsonify({'error': 'An error occurred while fetching leaderboard'}), 500

@leaderboard_bp.route('/user/<int:user_id>', methods=['GET'])
@jwt_required()
def get_user_stats(user_id):
    try:
        # Verify user can only access their own stats
        current_user_id = get_jwt_identity()
        if current_user_id != user_id:
            return jsonify({'error': 'Unauthorized'}), 403
        
        stats = Game.get_user_stats(user_id)
        return jsonify({'stats': stats}), 200
        
    except Exception as e:
        return jsonify({'error': 'An error occurred while fetching user stats'}), 500
