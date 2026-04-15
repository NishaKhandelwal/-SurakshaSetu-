// services/mlService.js
const axios = require("axios");

exports.getExpectedIncome = async (data) => {
    const res = await axios.post("http://localhost:5001/predict-income", data);
    return res.data.expected_income;
};

exports.checkFraud = async (data) => {
    const res = await axios.post("http://localhost:5001/detect-fraud", data);
    return res.data.fraud;
};