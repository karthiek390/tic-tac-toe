from flask import Flask
from flask_cors import CORS
from app.routes.game_routes import game_bp

app = Flask(__name__)
CORS(app)

# Register blueprint
app.register_blueprint(game_bp, url_prefix="/api")

if __name__ == "__main__":
    app.run(debug=True)
