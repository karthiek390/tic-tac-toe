from flask import Blueprint, request, jsonify
from app.models.gamelog import GameLog
from app.models.database import db_session
import json
from app.models.database import SessionLocal


log_game_bp = Blueprint("log_game", __name__)

# @log_game_bp.route("/log-game", methods=["POST"])
# def log_game():
#     data = request.get_json()

#     # Save the entire game log JSON as a string
#     game_log = GameLog(log_data=json.dumps(data))

#     # Save to DB
#     db_session.add(game_log)
#     db_session.commit()

#     return jsonify({"message": "Game log saved successfully"}), 201

@log_game_bp.route("/log-game", methods=["POST"])
def log_game():
    data = request.get_json()

    move_history = data.get("moveHistory", [])
    insights = data.get("insights", [])

    # Convert Python objects to JSON strings for DB storage
    move_history_str = json.dumps(move_history)
    insights_str = json.dumps(insights)

    db = SessionLocal()
    try:
        game_log = GameLog(
            move_history_json=move_history_str,
            insights=insights_str
        )
        db.add(game_log)
        db.commit()
        return jsonify({"message": "Game log saved successfully"}), 201
    except Exception as e:
        db.rollback()
        return jsonify({"error": f"Failed to save game log: {str(e)}"}), 500
    finally:
        db.close()

# @log_game_bp.route('/log-game', methods=['POST'])
# def log_game():
#     data = request.get_json()

#     print("📘 New game logged:")
#     print("Move history:", data.get("moveHistory"))
#     print("Insights:", data.get("insights"))

#     return jsonify({"message": "Game log received."}), 200
