const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const userRoutes = require("./routes/userRoutes");
const policyRoutes = require("./routes/policyRoutes");
const weatherRoutes = require("./routes/weatherRoutes");
const claimsRoutes = require("./routes/claims");

app.use("/api/users", userRoutes);
app.use("/api/policy", policyRoutes);
app.use("/api/weather", weatherRoutes);
app.use("/api/claims", claimsRoutes);

require("./cron/claimCron");

// MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

// Test Route
app.get("/", (req, res) => {
  res.send("API Running...");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
