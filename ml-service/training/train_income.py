import pandas as pd
from sklearn.ensemble import RandomForestRegressor
import joblib

# Load dataset
data = pd.read_csv("../../dataset/income_data.csv")

# Features & target
X = data.drop("income", axis=1)
y = data["income"]

# Train model
model = RandomForestRegressor(n_estimators=100, random_state=42)
model.fit(X, y)

# Save model
joblib.dump(model, "../models/income_model.pkl")

print("✅ Income model trained and saved!")