from flask import Blueprint, request, jsonify, send_file
import pandas as pd
import os
import uuid

from config import FILTERED_FOLDER

download_bp = Blueprint("download_bp", __name__)

@download_bp.route("/api/download", methods=["POST"])
def download_csv():

    try:

        data = request.json

        rows = data.get("rows")

        if not rows:
            return jsonify({
                "error": "No data available"
            }), 400

        df = pd.DataFrame(rows)

        filename = f"filtered_{uuid.uuid4().hex}.csv"

        filepath = os.path.join(
            FILTERED_FOLDER,
            filename
        )

        df.to_csv(filepath, index=False)

        return send_file(
            filepath,
            as_attachment=True,
            download_name=filename
        )

    except Exception as e:

        return jsonify({
            "error": str(e)
        }), 500