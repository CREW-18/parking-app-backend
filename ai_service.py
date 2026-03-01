from flask import Flask, jsonify
from flask_cors import CORS
from pymongo import MongoClient
import pandas as pd

app = Flask(__name__)
CORS(app)  # This allows your React Native app to talk to Python without security blocks

# 1. Connect to your exact local MongoDB database
# Note: 'test' is the default Mongoose database name. Change it if you named yours differently!
client = MongoClient("mongodb://127.0.0.1:27017/")
db = client['parkingDB']

@app.route('/api/heatmap', methods=['GET'])
def get_peak_heatmap():
    try:
        # 2. Fetch the live parking tickets directly from MongoDB (No CSV needed!)
        # Mongoose automatically names the collection 'parkings' (lowercase, plural)
        parking_data = list(db.parkings.find())

        if not parking_data:
            return jsonify({"message": "Not enough data yet to generate heatmap", "matrix": {}}), 200

        # 3. Load the database data into your friend's Pandas structure
        df = pd.DataFrame(parking_data)

        # Map the MongoDB columns to match your friend's logic exactly
        df['timestamp'] = df['entryTime']
        df['zone'] = df['slotId'].astype(str) # Convert MongoDB ObjectIds to normal text
        df['occupied'] = 1 # Every parking ticket counts as 1 occupied event

        # --- YOUR FRIEND'S EXACT PANDAS LOGIC ---
        df['timestamp'] = pd.to_datetime(df['timestamp'], errors="coerce")
        df = df.dropna(subset=['timestamp', 'zone'])

        # Timezone conversion (Crucial for accurate local heatmaps)
        if df['timestamp'].dt.tz is None:
            df['timestamp'] = df['timestamp'].dt.tz_localize("UTC").dt.tz_convert("Asia/Kolkata")
        else:
            df['timestamp'] = df['timestamp'].dt.tz_convert("Asia/Kolkata")

        df["hour"] = df['timestamp'].dt.hour

        # Generate the Pivot Matrix
        pivot = (
            df.pivot_table(
                index="zone",
                columns="hour",
                values="occupied",
                aggfunc="sum",
                fill_value=0
            )
            .reindex(columns=range(24), fill_value=0)
            .sort_index()
        )
        # --- END OF FRIEND'S LOGIC ---

        # 4. Beam the matrix directly to React Native as JSON!
        return jsonify({
            "status": "success",
            "matrix": pivot.to_dict()
        }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    # '0.0.0.0' tells Python to listen to your phone on the Wi-Fi, not just localhost
    app.run(host='0.0.0.0', port=5001, debug=True)