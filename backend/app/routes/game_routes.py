from flask import Blueprint, request, jsonify
from app.services.tic_tac_toe_engine import TicTacToe
from app.services.ai_strategy_controller import StrategyController

game_bp = Blueprint("game_bp", __name__)
game = TicTacToe(n=3)

@game_bp.route("/new-game", methods=["POST"])
def new_game():
    """
    Starts a new game. Accepts a 'strategy_id' in the POST body to select the AI strategy.
    """
    global game
    data = request.get_json() or {}
    strategy_id = data.get("strategy_id", "random")
    game = TicTacToe(n=3, strategy_id=strategy_id)
    return jsonify({"board": game.board, "strategy_id": strategy_id, "message": "New game started"})

@game_bp.route("/move", methods=["POST"])
def move():
    """
    Handles a player move. If it's the AI's turn after the move, invokes the selected AI strategy.
    """
    global game
    data = request.get_json()
    row, col, player = data["row"], data["col"], data["player"]

    success = game.make_move(row, col, player)
    if not success:
        return jsonify({"error": "Invalid move"}), 400

    result = game.get_status()
    response = {"board": game.board, "status": result}

    # If game is ongoing and it's AI's turn, make AI move
    if result == "Ongoing" and game.current_player == "O":
        strategy_id = getattr(game, "strategy_id", "random")
        strategy = StrategyController.get_strategy(strategy_id)
        ai_move = strategy.choose_move(game.board, "O")
        if ai_move:
            ai_row, ai_col = ai_move
            game.make_move(ai_row, ai_col, "O")
            result = game.get_status()
            response = {
                "board": game.board,
                "status": result,
                "ai_move": {"row": ai_row, "col": ai_col},
                "strategy_id": strategy_id,
            }
    return jsonify(response)
