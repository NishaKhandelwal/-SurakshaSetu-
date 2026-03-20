# 🚀 SurakshaSetu (सुरक्षा सेतु)

> “A smart bridge that protects gig workers’ income during disruptions.”
> Building a safety net for gig workers with AI-driven income protection and automatic payouts.

---

## 📌 Problem Statement

Delivery partners working with platforms like Swiggy and Zomato are a key part of India’s gig economy.

However, external factors such as:

* Heavy rain 🌧️
* Extreme heat ☀️
* High pollution 🌫️

can reduce their working hours and cause **20–30% income loss per week**.

Currently, there is **no income protection system** for such situations.

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

1. User signs up and connects platform
2. Activates weekly policy
3. Receives pre-shift risk alerts
4. System monitors activity + environment
5. Detects disruption
6. Verifies income loss (Income Oracle)
7. Sends instant payout via UPI

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

### Risk Prediction

* Weather + historical + demand patterns

### Dynamic Pricing

* Weekly premium adjusts based on risk

### Fraud Detection

* GPS validation
* Activity tracking
* Duplicate claim detection

### Income Oracle (Core)

* Verifies real income loss

---

## 🛡️ Adversarial Defense & Anti-Spoofing Strategy

Due to rising threats like GPS spoofing and coordinated fraud attacks, SurakshaSetu integrates a **multi-layered fraud defense system**.

---

### 🔍 1. Differentiation: Real vs Fake Claims

Instead of relying only on GPS, we use:

* 📍 Location consistency vs historical patterns
* 🚴 Movement behavior during shifts
* 📦 Order activity vs expected demand
* 🌧️ Environmental validation

👉 Real users show **consistent activity**, while fraud users show **static or abnormal patterns**

---

### 📊 2. Data Beyond GPS

We analyze:

* Device ID & session behavior
* App usage patterns
* Order acceptance & completion rates
* Route & speed consistency
* Network anomalies (sudden jumps)
* Cluster detection (multiple similar claims)

👉 Helps detect **organized fraud rings**

---

### ⚖️ 3. UX Balance (Fairness)

* Soft flagging instead of instant rejection
* Delayed validation for accuracy
* Alternative verification if GPS fails
* User notification for flagged claims

👉 Ensures **fair treatment for genuine workers**

---

### 🧠 AI Fraud Layer

* Anomaly detection
* Pattern recognition
* Risk scoring per claim

---

### 🚀 Outcome

* Prevents mass fake payouts
* Maintains trust and fairness
* Builds a secure insurance system

---

## 📱 Platform Choice

Mobile App:

* Easy access
* Real-time alerts
* GPS tracking
* Instant payouts

---

## 🛠️ Tech Stack

Frontend: React Native
Backend: Node.js + Express
Database: MongoDB
AI/ML: Python (Scikit-learn)

APIs:

* Weather APIs
* Mock delivery APIs
* UPI integration

---

## 📅 Development Plan

Phase 1: Ideation + Documentation ✅
Phase 2: Core features + automation
Phase 3: AI + fraud detection + scaling

---

## 🌟 USP

* Income-focused insurance
* Shift-level protection
* Instant payouts
* AI-driven system
* Strong anti-fraud architecture

---

## 📄 Insurance Policy

Full policy available in: `policy.md`

---

## 🎯 Vision

Build a system where:

**No delivery worker loses income due to external disruptions**

---



