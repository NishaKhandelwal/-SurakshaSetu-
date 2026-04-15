from sklearn.linear_model import LinearRegression
import numpy as np

# ==========================================================
# SurakshaSetu AI Risk Model Prototype
# Input Features: [Rainfall (mm), Temperature (°C), AQI]
# Output: Risk Score
# ==========================================================

# Demo training data
# Each row = [rain, temp, aqi]
X = np.array([
    [0, 28, 50],
    [5, 30, 100],
    [15, 34, 180],
    [30, 36, 220],
    [45, 39, 280],
    [60, 41, 320],
    [80, 44, 400],
    [100, 46, 450]
])

# Target risk scores (demo labels)
y = np.array([
    20,   # low risk
    35,   # low-moderate
    60,   # moderate
    85,   # elevated
    120,  # high
    150,  # very high
    210,  # severe
    240   # critical
])

# Train regression model
model = LinearRegression()
model.fit(X, y)

def predict_risk(rain, temp, aqi):
    """
    Predict disruption risk score based on rain, temperature, and AQI.
    """
    features = np.array([[rain, temp, aqi]])
    risk_score = model.predict(features)[0]

    # Ensure non-negative and readable value
    return max(0, round(float(risk_score), 2))

# Demo run (optional test)
if __name__ == "__main__":
    rain = 50
    temp = 39
    aqi = 300

    predicted = predict_risk(rain, temp, aqi)
    print("Predicted Risk Score:", predicted)