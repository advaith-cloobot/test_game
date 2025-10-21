from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.game import Game

game_bp = Blueprint('game', __name__)

@game_bp.route('/save', methods=['POST'])
@jwt_required()
def save_game():
    try:
        user_id = get_jwt_identity()
        data = request.get_json()
        
        user_score = data.get('userScore')
        computer_score = data.get('computerScore')
        
        if user_score is None or computer_score is None:
            return jsonify({'error': 'Scores are required'}), 400
        
        # Determine result
        result = 'win' if user_score > computer_score else 'loss'
        
        # Save game
        game_id = Game.create(user_id, user_score, computer_score, result)
        
        return jsonify({
            'message': 'Game saved successfully',
            'game_id': game_id
        }), 201
        
    except Exception as e:
        return jsonify({'error': 'An error occurred while saving game'}), 500

@game_bp.route('/user/<int:user_id>', methods=['GET'])
@jwt_required()
def get_user_games(user_id):
    try:
        # Verify user can only access their own games
        current_user_id = get_jwt_identity()
        if current_user_id != user_id:
            return jsonify({'error': 'Unauthorized'}), 403
        
        games = Game.get_user_games(user_id)
        return jsonify({'games': games}), 200
        
    except Exception as e:
        return jsonify({'error': 'An error occurred while fetching games'}), 500
