import pandas as pd
from sklearn.ensemble import IsolationForest
import joblib

# Load dataset
data = pd.read_csv("../../dataset/fraud_data.csv")

# Train model
model = IsolationForest(contamination=0.2, random_state=42)
model.fit(data)

# Save model
joblib.dump(model, "../models/fraud_model.pkl")

print("✅ Fraud model trained and saved!")