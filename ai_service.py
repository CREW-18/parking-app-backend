import os

import pandas as pd
from flask import Flask, jsonify
from flask_cors import CORS
from pymongo import MongoClient

app = Flask(__name__)
CORS(app)

mongo_uri = os.getenv("MONGO_URI", "mongodb://127.0.0.1:27017/parkpulse")
mongo_db = os.getenv("MONGO_DB", "parkpulse")
client = MongoClient(mongo_uri)
db = client[mongo_db]


@app.route("/api/heatmap", methods=["GET"])
def get_peak_heatmap():
    try:
        parking_data = list(db.parkings.find())

        if not parking_data:
            return jsonify({"message": "Not enough data yet to generate heatmap", "matrix": {}}), 200

        df = pd.DataFrame(parking_data)
        df["timestamp"] = df["entryTime"]
        df["zone"] = df["slotId"].astype(str)
        df["occupied"] = 1

        df["timestamp"] = pd.to_datetime(df["timestamp"], errors="coerce")
        df = df.dropna(subset=["timestamp", "zone"])

        if df["timestamp"].dt.tz is None:
            df["timestamp"] = df["timestamp"].dt.tz_localize("UTC").dt.tz_convert("Asia/Kolkata")
        else:
            df["timestamp"] = df["timestamp"].dt.tz_convert("Asia/Kolkata")

        df["hour"] = df["timestamp"].dt.hour

        pivot = (
            df.pivot_table(
                index="zone",
                columns="hour",
                values="occupied",
                aggfunc="sum",
                fill_value=0,
            )
            .reindex(columns=range(24), fill_value=0)
            .sort_index()
        )

        return jsonify({"status": "success", "matrix": pivot.to_dict()}), 200
    except Exception as error:
        return jsonify({"error": str(error)}), 500


if __name__ == "__main__":
    port = int(os.getenv("AI_SERVICE_PORT", "5001"))
    app.run(host="0.0.0.0", port=port, debug=True)
