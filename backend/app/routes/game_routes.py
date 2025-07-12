from flask import Blueprint, request, jsonify
from app.services.tic_tac_toe_engine import TicTacToe

game_bp = Blueprint("game_bp", __name__)
game = TicTacToe(n=3)

@game_bp.route("/new-game", methods=["POST"])
def new_game():
    global game
    game = TicTacToe(n=3)
    return jsonify({"board": game.board, "message": "New game started"})

@game_bp.route("/move", methods=["POST"])
def move():
    data = request.get_json()
    row, col, player = data["row"], data["col"], data["player"]

    success = game.make_move(row, col, player)
    if not success:
        return jsonify({"error": "Invalid move"}), 400

    result = game.get_status()
    return jsonify({"board": game.board, "status": result})
