const cron = require("node-cron");
const { getWeatherDataAndRisk } = require("../services/weatherService");
const { autoCreateAndApproveClaims } = require("../services/claimService");

// Runs every hour
cron.schedule("0 * * * *", async () => {
  console.log("[CRON] Running weather trigger check...");

  try {
    const city = process.env.WEATHER_CITY || "Delhi";

    const weatherData = await getWeatherDataAndRisk(city);

    console.log("[CRON] Weather data:", {
      rain: weatherData.rain,
      temp: weatherData.temp,
      aqi: weatherData.aqi,
    });

    const claims = await autoCreateAndApproveClaims({
      rain: weatherData.rain,
      temp: weatherData.temp,
      aqi: weatherData.aqi,
    });

    console.log(`[CRON] Auto-created & approved ${claims.length} claim(s).`);
  } catch (err) {
    console.error("[CRON] Error:", err.message);
  }
});

console.log("[CRON] Weather trigger cron job scheduled (every hour).");
