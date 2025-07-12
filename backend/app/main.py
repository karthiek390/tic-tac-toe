from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

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

# Route to start a new game
@app.route('/api/new-game', methods=['POST'])
def new_game():
    return jsonify({
        'board': create_empty_board(),
        'currentPlayer': 'X',
        'winner': None,
        'winningCells': [],
        'gameEnded': False
    })

# Route to handle moves
@app.route('/api/move', methods=['POST'])
def make_move():
    data = request.get_json()
    board = data['board']
    row = data['row']
    col = data['col']
    current_player = data['currentPlayer']

    if board[row][col] is not None:
        return jsonify({'error': 'Cell already filled'}), 400

    board[row][col] = current_player
    winner, winning_cells = check_winner(board)

    if winner:
        return jsonify({
            'board': board,
            'currentPlayer': current_player,
            'winner': winner,
            'winningCells': winning_cells,
            'gameEnded': True
        })

    if is_full(board):
        return jsonify({
            'board': board,
            'currentPlayer': current_player,
            'winner': None,
            'winningCells': [],
            'gameEnded': True
        })

    next_player = 'O' if current_player == 'X' else 'X'
    return jsonify({
        'board': board,
        'currentPlayer': next_player,
        'winner': None,
        'winningCells': [],
        'gameEnded': False
    })

if __name__ == '__main__':
    app.run(debug=True)
