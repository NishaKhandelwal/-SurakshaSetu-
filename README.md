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

1. **User Onboarding**

   * Sign up via mobile app
   * Connect delivery platform (simulated API)
   * Enable GPS tracking

2. **Weekly Policy Creation**

   * AI calculates premium
   * User activates weekly coverage

3. **Pre-Shift Alerts**

   * System predicts risks using weather + demand data
   * Alerts user before risky shifts

4. **Real-Time Monitoring**

   * Tracks worker activity and location

5. **Trigger Detection**

   * Detects environmental disruption automatically

6. **Income Verification (Income Oracle)**

   * Checks:

     * Worker was active
     * Orders dropped significantly
     * Worker is in affected area

7. **Automatic Payout**

   * Money sent instantly via UPI
   * No manual claim required

---

## 💰 Weekly Premium Model

Premium is calculated weekly using AI.

### Formula:

```
Weekly Premium = Base + Weather Risk + City Risk - Reliability Discount
```

### Example:

* Base = ₹30
* Weather Risk = ₹25
* City Risk = ₹20
* Discount = ₹10

👉 Final Premium = ₹65/week

### Range:

* Low Risk: ₹40
* Medium Risk: ₹60
* High Risk: ₹80–₹100

---

## ⚡ Parametric Triggers

Payouts are triggered automatically when conditions are met.

| Event        | Trigger Condition  |
| ------------ | ------------------ |
| Heavy Rain   | Rainfall > 80 mm   |
| Extreme Rain | Rainfall > 120 mm  |
| Heatwave     | Temperature > 45°C |
| Pollution    | AQI > 400          |

### Data Sources:

* OpenWeather
* Indian Meteorological Department

(Mock APIs may be used during development)

---

## 💸 Payout Logic

Payout is based on income loss.

### Example:

* Expected income = ₹700
* Actual income = ₹200
* Loss = ₹500

👉 Coverage = 30–40%
👉 Payout = ₹150–₹200

---

## 🤖 AI/ML Integration

### 1. Risk Prediction

* Uses weather data, historical trends, and demand patterns

### 2. Dynamic Premium Calculation

* Adjusts weekly premium based on risk and worker behavior

### 3. Fraud Detection

* GPS validation
* Activity tracking
* Duplicate claim detection
* Anomaly detection

### 4. Income Oracle (Core Innovation)

* Verifies real income loss before payout

---

## 📱 Platform Choice

We chose a **mobile app** because:

* Delivery workers primarily use smartphones
* Real-time alerts are needed
* GPS tracking is essential
* Easy UPI payouts

---

## 🛠️ Tech Stack

**Frontend:** React Native
**Backend:** Node.js + Express
**Database:** MongoDB
**AI/ML:** Python (Scikit-learn)

**APIs:**

* Weather APIs (real + mock)
* Simulated delivery APIs
* UPI payment integration

---

## 📅 Development Plan

* **Phase 1:** Research + Idea + Documentation ✅
* **Phase 2:** Backend + AI models
* **Phase 3:** Mobile app development
* **Phase 4:** Integration + Testing + Demo

---

## 🌟 Unique Selling Points (USP)

* Focuses only on **income protection**
* Provides **shift-level coverage**
* Predicts risks before they occur
* Offers **instant payouts without claims**
* Uses **AI for pricing and fraud detection**
* Introduces **Income Oracle for fair validation**

---

## 📄 Insurance Policy

👉 Read the full policy here: **[SurakshaSetu Policy](./policy.md)**

---

## 🎯 Final Vision

SurakshaSetu aims to become a **financial safety net for gig workers** by combining:

* AI-powered prediction
* Real-time monitoring
* Automated insurance payouts

👉 Our goal:
**“No delivery worker should lose income due to factors beyond their control.”**

---


