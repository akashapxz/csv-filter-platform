import os
from flask import Blueprint, request, jsonify
from werkzeug.utils import secure_filename

from config import UPLOAD_FOLDER
from utils.helpers import allowed_file

from services.csv_service import (
    read_csv_file,
    get_columns,
    get_preview_data
)

from models.file_model import db, UploadedFile

upload_bp = Blueprint("upload_bp", __name__)

@upload_bp.route("/api/upload", methods=["POST"])
def upload_csv():

    if "file" not in request.files:
        return jsonify({
            "error": "No file part"
        }), 400

    file = request.files["file"]

    if file.filename == "":
        return jsonify({
            "error": "No selected file"
        }), 400

    if not allowed_file(file.filename):
        return jsonify({
            "error": "Only CSV files are allowed"
        }), 400

    try:
        filename = secure_filename(file.filename)

        filepath = os.path.join(UPLOAD_FOLDER, filename)

        file.save(filepath)

        # Read CSV
        df = read_csv_file(filepath)

        # Extract Information
        columns = get_columns(df)
        preview = get_preview_data(df)

        # Save Metadata to Database
        uploaded_file = UploadedFile(
            filename=filename,
            filepath=filepath
        )

        db.session.add(uploaded_file)
        db.session.commit()

        return jsonify({
            "message": "File uploaded successfully",
            "file_id": uploaded_file.id,
            "filename": filename,
            "columns": columns,
            "preview": preview,
            "total_rows": len(df)
        })

    except Exception as e:
        print("UPLOAD ERROR:", str(e))

    return jsonify({
        "error": str(e)
    }), 500