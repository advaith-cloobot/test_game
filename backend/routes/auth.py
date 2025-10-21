from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from models.user import User

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/signup', methods=['POST'])
def signup():
    try:
        data = request.get_json()
        username = data.get('username')
        email = data.get('email')
        password = data.get('password')
        confirm_password = data.get('confirmPassword')
        
        # Validation
        if not all([username, email, password, confirm_password]):
            return jsonify({'error': 'All fields are required'}), 400
        
        if password != confirm_password:
            return jsonify({'error': 'Passwords do not match'}), 400
        
        if len(password) < 6:
            return jsonify({'error': 'Password must be at least 6 characters'}), 400
        
        # Create user
        user_id = User.create(username, email, password)
        
        # Create JWT token
        access_token = create_access_token(identity=user_id)
        
        return jsonify({
            'message': 'User created successfully',
            'access_token': access_token,
            'user_id': user_id
        }), 201
        
    except ValueError as e:
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        return jsonify({'error': 'An error occurred during signup'}), 500

@auth_bp.route('/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        username = data.get('username')
        password = data.get('password')
        
        if not username or not password:
            return jsonify({'error': 'Username and password are required'}), 400
        
        # Find user
        user = User.find_by_username(username)
        if not user:
            return jsonify({'error': 'Invalid credentials'}), 401
        
        # Check password (simple comparison for now)
        if user.password != password:
            return jsonify({'error': 'Invalid credentials'}), 401
        
        # Create JWT token
        access_token = create_access_token(identity=user.id)
        
        return jsonify({
            'message': 'Login successful',
            'access_token': access_token,
            'user_id': user.id,
            'username': user.username
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'An error occurred during login'}), 500

@auth_bp.route('/logout', methods=['POST'])
@jwt_required()
def logout():
    # In a real app, you might want to blacklist the token
    return jsonify({'message': 'Logout successful'}), 200

@auth_bp.route('/me', methods=['GET'])
@jwt_required()
def get_current_user():
    user_id = get_jwt_identity()
    user = User.find_by_id(user_id)
    if user:
        return jsonify({
            'id': user.id,
            'username': user.username,
            'email': user.email
        }), 200
    return jsonify({'error': 'User not found'}), 404
