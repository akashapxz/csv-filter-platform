from flask import Flask
from flask_cors import CORS

from config import (
    SQLALCHEMY_DATABASE_URI,
    SQLALCHEMY_TRACK_MODIFICATIONS
)

from models.file_model import db

from routes.upload_routes import upload_bp
from routes.filter_routes import filter_bp
from routes.download_routes import download_bp
from routes.history_routes import history_bp

app = Flask(__name__)

# Configurations
app.config["SQLALCHEMY_DATABASE_URI"] = SQLALCHEMY_DATABASE_URI
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = SQLALCHEMY_TRACK_MODIFICATIONS

CORS(app)

# Initialize Database
db.init_app(app)

# Create Tables
with app.app_context():
    db.create_all()

# Register Blueprints
app.register_blueprint(upload_bp)
app.register_blueprint(filter_bp)
app.register_blueprint(download_bp)
app.register_blueprint(history_bp)

@app.route("/")
def home():
    return {
        "message": "CSV Filter Platform Backend Running"
    }

if __name__ == "__main__":
    app.run(debug=True)