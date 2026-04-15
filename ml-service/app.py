from flask import Flask, request, jsonify
import joblib
import numpy as np

app = Flask(__name__)

# Load trained models
income_model = joblib.load("models/income_model.pkl")
fraud_model = joblib.load("models/fraud_model.pkl")

@app.route("/predict-income", methods=["POST"])
def predict_income():
    data = request.json

    values = [
        data["past_income"],
        data["hours"],
        data["rainfall"],
        data["temp"],
        data["aqi"],
        data["time_of_day"]
    ]

    prediction = income_model.predict([values])

    return jsonify({
        "expected_income": float(prediction[0])
    })

@app.route("/detect-fraud", methods=["POST"])
def detect_fraud():
    data = request.json

    values = [
        data["speed"],
        data["route_variance"],
        data["order_rate"],
        data["session_time"]
    ]

    result = fraud_model.predict([values])

    return jsonify({
        "fraud": int(result[0] == -1)
    })

if __name__ == "__main__":
    app.run(port=5001)