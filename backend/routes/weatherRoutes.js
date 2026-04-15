const express = require("express");
const router = express.Router();

const { getWeatherDataAndRisk } = require("../services/weatherService");

// GET /api/weather/:city
router.get("/:city", async (req, res) => {
  try {
    const city = req.params.city;

    const weatherInfo = await getWeatherDataAndRisk(city);

    res.status(200).json({
      message: "Weather data fetched successfully",
      data: weatherInfo
    });

  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
});

module.exports = router;