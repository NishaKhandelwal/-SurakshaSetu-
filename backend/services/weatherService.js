const axios = require("axios");

// --------------------------
// Calculate city risk
// --------------------------
function getCityRisk(city) {
  const cityRiskMap = {
    delhi: 150,
    mumbai: 120,
    bangalore: 100,
    ahmedabad: 90,
    vadodara: 80,
    pune: 95,
    kolkata: 110,
    chennai: 105
  };

  return cityRiskMap[city.toLowerCase()] || 75;
}

// --------------------------
// Calculate discount
// --------------------------
function getDiscount() {
  // Static for now (can be made dynamic later)
  return 50;
}

// --------------------------
// Convert OpenWeather AQI level (1–5) to demo AQI value
// --------------------------
function mapAqiLevel(aqiLevel) {
  const map = {
    1: 50,
    2: 100,
    3: 200,
    4: 300,
    5: 450
  };
  return map[aqiLevel] || 0;
}

// --------------------------
// Risk scoring logic
// --------------------------
function calculateWeatherRisk(rain = 0, temp = 0, aqi = 0) {
  let weatherRisk = 0;

  // Rain-based pricing
  if (rain > 80) weatherRisk += 200;
  else if (rain > 40) weatherRisk += 120;
  else if (rain > 10) weatherRisk += 60;

  // Heat-based pricing
  if (temp > 45) weatherRisk += 180;
  else if (temp > 38) weatherRisk += 100;
  else if (temp > 32) weatherRisk += 50;

  // Pollution-based pricing
  if (aqi > 400) weatherRisk += 180;
  else if (aqi > 250) weatherRisk += 100;
  else if (aqi > 150) weatherRisk += 50;

  return weatherRisk;
}

// --------------------------
// Main function
// --------------------------
async function getWeatherDataAndRisk(city) {
  try {
    const apiKey = process.env.OPENWEATHER_API_KEY;

    if (!apiKey) {
      throw new Error("OPENWEATHER_API_KEY not found in .env");
    }

    // 1. Current weather
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    const weatherRes = await axios.get(weatherUrl);

    const weatherData = weatherRes.data;

    const temp = weatherData.main?.temp || 0;
    const rain = weatherData.rain?.["1h"] || weatherData.rain?.["3h"] || 0;
    const lat = weatherData.coord.lat;
    const lon = weatherData.coord.lon;

    // 2. Air pollution
    const airUrl = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`;
    const airRes = await axios.get(airUrl);

    const aqiLevel = airRes.data.list[0].main.aqi;
    const aqi = mapAqiLevel(aqiLevel);

    // 3. Weather risk
    const weatherRisk = calculateWeatherRisk(rain, temp, aqi);

    // 4. City risk + discount
    const cityRisk = getCityRisk(city);
    const discount = getDiscount();

    return {
      city,
      temp,
      rain,
      aqi,
      weatherRisk,
      cityRisk,
      discount
    };

  } catch (error) {
    console.error("Weather Service Error:", error.message);

    // Fallback so policy creation doesn't fail in demo
    return {
      city,
      temp: 0,
      rain: 0,
      aqi: 100,
      weatherRisk: 80,
      cityRisk: getCityRisk(city),
      discount: getDiscount()
    };
  }
}

module.exports = {
  getWeatherDataAndRisk
};