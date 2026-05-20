# AI Analytics Service

The Park Pulse AI Service is an independent microservice responsible for analyzing historical parking session data and generating time-based occupancy heatmaps.

## Core Technologies

- **Language**: Python 3
- **Framework**: Flask
- **Data Analysis**: Pandas
- **Database Driver**: PyMongo

## Purpose

The service reads the `parkings` collection from MongoDB (which records vehicle entries and exits) and transforms this raw session data into a structured heatmap matrix. This allows frontends to display predictive analytics, such as showing users the busiest hours for specific parking slots or venues.

## How It Works

1. **Data Ingestion**: The Flask app (`ai_service.py`) connects directly to the shared MongoDB database.
2. **Data Frame Conversion**: When the `/api/heatmap` endpoint is hit, it queries the `parkings` collection and loads the documents into a Pandas DataFrame.
3. **Time-Series Processing**:
   - Extracts the `entryTime` (timestamp) and `slotId` (zone).
   - Localizes the timezone to `Asia/Kolkata`.
   - Extracts the hour (0-23) from the timestamp.
4. **Aggregation**: It uses Pandas `pivot_table` to group the data by `zone` (rows) and `hour` (columns), summing up the total number of occupied events for each hour.
5. **Output**: Returns a JSON dictionary representing the matrix, filling missing hours with zeros.

## API Endpoint

```text
GET /api/heatmap
```

**Response format**:
```json
{
  "status": "success",
  "matrix": {
    "slot_id_1": { "0": 0, "1": 0, ..., "12": 5, "13": 8, ... "23": 0 },
    "slot_id_2": { "0": 0, "1": 0, ..., "12": 2, "13": 4, ... "23": 0 }
  }
}
```

## Running the Service

1. Ensure Python is installed.
2. Install requirements:
   ```bash
   pip install -r requirements.txt
   ```
3. Set environment variables (optional defaults exist):
   - `MONGO_URI`: Connection string for MongoDB.
   - `MONGO_DB`: Target database name.
   - `AI_SERVICE_PORT`: Port to run the server on (default 5001).
4. Start the server:
   ```bash
   python ai_service.py
   ```