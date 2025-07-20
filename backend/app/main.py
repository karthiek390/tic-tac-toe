import random
from flask import Flask, request, jsonify
from flask_cors import CORS
from app.routes.log_game import log_game_bp
from app.models.database import Base, engine
from app.models.gamelog import GameLog
from app.services.tic_tac_toe_engine import TicTacToe
import os

app = Flask(__name__)
CORS(app)
app.register_blueprint(log_game_bp, url_prefix="/api")

# Constants
BOARD_SIZE = 3

# Helper functions
def create_empty_board():
    return [[None for _ in range(BOARD_SIZE)] for _ in range(BOARD_SIZE)]

def check_winner(board):
    size = len(board)

    # Check rows and columns
    for i in range(size):
        if board[i][0] and all(board[i][j] == board[i][0] for j in range(size)):
            return board[i][0], [[i, j] for j in range(size)]
        if board[0][i] and all(board[j][i] == board[0][i] for j in range(size)):
            return board[0][i], [[j, i] for j in range(size)]

    # Diagonal
    if board[0][0] and all(board[i][i] == board[0][0] for i in range(size)):
        return board[0][0], [[i, i] for i in range(size)]

    # Anti-diagonal
    if board[0][size-1] and all(board[i][size-1-i] == board[0][size-1] for i in range(size)):
        return board[0][size-1], [[i, size-1-i] for i in range(size)]

    return None, []

def is_full(board):
    return all(cell is not None for row in board for cell in row)

@app.route('/health', methods=['GET'])
def health_check():
    return 'OK', 200

# Route to start a new game
@app.route('/api/new-game', methods=['POST'])
def new_game():
    data = request.get_json() or {}
    first_player = data.get('firstPlayer', 'X')  # default to user (X) if not provided

    game = TicTacToe(3)
    game.current_player = first_player

    # If AI (O) starts first, make the AI move before returning board
    if first_player == 'O':
        move = game.find_best_move()
        if move:
            game.make_move(move[0], move[1], 'O')

    return jsonify({
        'board': game.board,
        'currentPlayer': game.current_player,
        'winner': game.winner,
        'winningCells': [],
        'gameEnded': game.winner is not None
    })



# Route to handle moves
@app.route('/api/move', methods=['POST'])
def make_move():
    data = request.get_json()
    board = data['board']
    row = data.get('row')
    col = data.get('col')
    current_player = data['currentPlayer']  # Should be 'X' (user)

    # Human move
    if row is not None and col is not None:
        if not (0 <= row < 3 and 0 <= col < 3):
            return jsonify({'error': 'Invalid move'}), 400
        if board[row][col] is not None:
            return jsonify({'error': 'Cell already filled'}), 400
        board[row][col] = current_player

        winner, winning_cells = check_winner(board)
        if winner or is_full(board):
            return jsonify({
                'board': board,
                'currentPlayer': current_player,
                'winner': winner,
                'winningCells': winning_cells,
                'gameEnded': True
            })

    # AI move
    game = TicTacToe(3)
    game.board = board
    game.current_player = 'O'
    ai_move = game.find_best_move()
    if ai_move:
        ai_row, ai_col = ai_move
        game.make_move(ai_row, ai_col, 'O')
        board = game.board

        winner, winning_cells = check_winner(board)
        if winner or is_full(board):
            return jsonify({
                'board': board,
                'currentPlayer': 'X',
                'winner': winner,
                'winningCells': winning_cells,
                'gameEnded': True
            })

    return jsonify({
        'board': board,
        'currentPlayer': 'X',
        'winner': None,
        'winningCells': [],
        'gameEnded': False
    })

# Create the database tables at startup
Base.metadata.create_all(bind=engine)

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=True)

