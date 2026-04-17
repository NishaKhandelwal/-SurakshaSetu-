# 🚀 SurakshaSetu (सुरक्षा सेतु)

> “A smart bridge that protects gig workers’ income during disruptions.”
> Building a safety net for gig workers with AI-driven income protection and automatic payouts.

---

## 📌 Problem Statement

Delivery partners working with platforms like Swiggy and Zomato are a key part of India’s gig economy.

However, external factors such as:

* 🌧️ Heavy rain
* ☀️ Extreme heat
* 🌫️ High pollution

can reduce their working hours and cause **20–30% income loss per week**.

👉 Currently, there is **no reliable income protection system** for such situations.

---

## 💡 Our Solution

**SurakshaSetu** is an AI-powered parametric insurance platform that:

* Predicts disruptions before they happen
* Protects workers during risky shifts
* Automatically detects income loss
* Instantly provides compensation

👉 It is not just insurance — it is a **smart protection system for gig workers**

---

## 👤 Target Persona

We focus on **food delivery partners**.

### Example:

Ravi is a delivery partner earning ₹6000–₹7000 per week.

During heavy rainfall:

* Orders drop significantly
* He stops working early
* He loses ₹600–₹900 in a single shift

👉 SurakshaSetu ensures he does not bear this loss alone.

---

## 🔄 Application Workflow

1. User signs up
2. Activates weekly policy
3. Receives pre-shift risk alerts
4. System monitors activity + environment
5. Detects disruption
6. Verifies income loss (Income Oracle)
7. Sends instant payout

---

## 💰 Weekly Premium Model

```
Weekly Premium = Base + Weather Risk + City Risk - Reliability Discount
```

### Example:

* Base = ₹30
* Weather Risk = ₹25
* City Risk = ₹20
* Discount = ₹10

👉 Final Premium = ₹65/week

---

## ⚡ Parametric Triggers

| Event        | Trigger Condition  |
| ------------ | ------------------ |
| Heavy Rain   | Rainfall > 80 mm   |
| Extreme Rain | Rainfall > 120 mm  |
| Heatwave     | Temperature > 45°C |
| Pollution    | AQI > 400          |

---

## 💸 Payout Logic

* Expected income vs Actual income
* Coverage: 30–40% of loss

👉 Example:
Loss = ₹500 → Payout = ₹150–₹200

---

## 🤖 AI/ML Integration

* Risk Prediction (weather + demand patterns)
* Dynamic Pricing
* Fraud Detection
* Income Oracle (core engine)

---

## 🛡️ Fraud Detection System

SurakshaSetu includes a **multi-layered fraud defense system**:

* GPS + movement validation
* Device & behavior tracking
* Order pattern analysis
* Network anomaly detection
* AI-based anomaly detection

👉 Ensures fairness and prevents fake claims

---

## 🏗️ Project Structure

```
SurakshaSetu/
├── backend/              # Node.js + Express API
├── ml-service/           # Python ML microservice
├── suraksha-frontend/    # Main frontend (FINAL UI)
├── old-frontend/         # Deprecated (not used)
```

> ⚠️ Use `suraksha-frontend` for running the project

---

## 🚀 How to Run Locally

### Backend

```bash
cd backend
npm install
npm start
```

### ML Service

```bash
cd ml-service
pip install -r requirements.txt
python app.py
```

### Frontend

```bash
cd suraksha-frontend
npm install
npm run dev
```

---

## 🎥 Demo Video

📽️ Screen-capture walkthrough showing:

* Login & dashboard
* AI-based claim trigger
* Automated payout

👉 **Watch here:** *https://drive.google.com/file/d/11dSYNmncX_Wgyjsn4w9ig06Sv30eoEyb/view?usp=drivesdk*
---

## 📊 Pitch Deck

📄 Project presentation (PPT/PDF):

👉 View Pitch Deck:  *https://drive.google.com/file/d/1VrITkVXX37-4_9Xj0ZP_xJKdg15xC41N/view?usp=sharing*

---

## 🛠️ Tech Stack

* Frontend: React + Tailwind
* Backend: Node.js + Express
* Database: MongoDB
* AI/ML: Python (Scikit-learn)

---

## 🌟 USP

* Income-focused insurance
* Instant automated payouts
* AI-driven decision making
* Strong anti-fraud system

---

## 🎯 Vision

Build a system where:

> **No delivery worker loses income due to external disruptions**

---
