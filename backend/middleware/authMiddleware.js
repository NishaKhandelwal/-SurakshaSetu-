const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  try {
    const authHeader = req.header("Authorization");

    if (!authHeader) {
      return res.status(401).json({ msg: "No token, access denied" });
    }

    // 🔥 Extract actual token
    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ msg: "Invalid token format" });
    }

    const verified = jwt.verify(token, process.env.JWT_SECRET);

    req.user = verified;

    next();

  } catch (err) {
    console.error("Auth Error:", err.message);
    res.status(401).json({ msg: "Invalid token" });
  }
};