from flask import Flask, request, jsonify
import os
from db_config import get_db_connection
from datetime import datetime

app = Flask(__name__)

# POST endpoint (existing)
@app.route('/sensor_data', methods=['POST'])
def receive_data():
    data = request.json
    temperature = data.get('temperature')
    humidity = data.get('humidity')
    timestamp = datetime.now()

    print(f"Received data: {data}")

    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        cursor.execute(
            "INSERT INTO sensor_data (temperature, humidity, timestamp) VALUES (%s, %s, %s)",
            (temperature, humidity, timestamp)
        )
        conn.commit()
        cursor.close()
        conn.close()

        return jsonify({"message": "Data stored successfully"}), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# NEW GET endpoint
@app.route('/sensor_data', methods=['GET'])
def get_data():
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)  # Return results as dictionaries

        # Get all data sorted by newest first
        cursor.execute("SELECT * FROM sensor_data ORDER BY timestamp DESC")
        results = cursor.fetchall()

        cursor.close()
        conn.close()

        return jsonify({
            "status": "success",
            "count": len(results),
            "data": results
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=int(os.environ.get('PORT', 5000)))