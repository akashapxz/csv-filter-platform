from flask import Blueprint, request, jsonify
import pandas as pd

from models.file_model import UploadedFile

filter_bp = Blueprint("filter_bp", __name__)


# FILTER DATA
@filter_bp.route("/api/filter", methods=["POST"])
@filter_bp.route("/api/filter", methods=["POST"])
def filter_data():

    try:

        data = request.json

        file_id = data.get("file_id")
        filters = data.get("filters")

        uploaded_file = UploadedFile.query.get(file_id)

        if not uploaded_file:
            return jsonify({
                "error": "File not found"
            }), 404

        df = pd.read_csv(uploaded_file.filepath)

        filtered_df = df.copy()

        for filter_item in filters:

            column = filter_item.get("column")
            operator = filter_item.get("operator")
            value = filter_item.get("value")

            if operator == "==":
                filtered_df = filtered_df[
                    filtered_df[column].astype(str) == value
                ]

            elif operator == "!=":
                filtered_df = filtered_df[
                    filtered_df[column].astype(str) != value
                ]

            elif operator == ">":
                filtered_df = filtered_df[
                    filtered_df[column] > float(value)
                ]

            elif operator == "<":
                filtered_df = filtered_df[
                    filtered_df[column] < float(value)
                ]

            elif operator == "contains":
                filtered_df = filtered_df[
                    filtered_df[column]
                    .astype(str)
                    .str.contains(value, case=False)
                ]

        return jsonify({
            "filtered_data":
                filtered_df.to_dict(orient="records"),

            "total_rows":
                len(filtered_df)
        })

    except Exception as e:

        return jsonify({
            "error": str(e)
        }), 500


# SELECT COLUMNS
@filter_bp.route("/api/select-columns", methods=["POST"])
def select_columns():

    try:

        data = request.json

        file_id = data.get("file_id")
        columns = data.get("columns")

        uploaded_file = UploadedFile.query.get(file_id)

        if not uploaded_file:
            return jsonify({
                "error": "File not found"
            }), 404

        df = pd.read_csv(uploaded_file.filepath)

        selected_df = df[columns]

        return jsonify({
            "preview":
                selected_df.to_dict(orient="records"),

            "columns":
                columns,

            "total_rows":
                len(selected_df)
        })

    except Exception as e:

        return jsonify({
            "error": str(e)
        }), 500