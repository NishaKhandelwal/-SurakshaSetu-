const cron = require("node-cron");
const { getWeatherDataAndRisk } = require("../services/weatherService");

// 🔥 FIXED IMPORT (from controller, not service)
const { autoCreateAndProcessClaims } = require("../controllers/claimController");

cron.schedule("*/1 * * * *", async () => {
  console.log("[CRON] Running weather trigger check...");

  try {
    const city = process.env.WEATHER_CITY || "Delhi";

    const weatherData = await getWeatherDataAndRisk(city);

    console.log("[CRON] Weather data:", {
      rain: weatherData.rain,
      temp: weatherData.temp,
      aqi: weatherData.aqi,
    });

    const claims = await autoCreateAndProcessClaims({
      rain: weatherData.rain,
      temp: weatherData.temp,
      aqi: weatherData.aqi,
    });

    console.log(`[CRON] Processed ${claims.length} claim(s) using ML.`);
    
  } catch (err) {
    console.error("[CRON] Error:", err.message);
  }
});

console.log("[CRON] Weather trigger cron job scheduled (every hour).");