const jwt = require("jsonwebtoken");
const User = require("../models/User");

async function authMiddleware(req, res, next) {
  try {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ success: false, message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    const payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    if (payload._id) {
      const user = await User.findById(payload._id).select("-password");
      if (!user) return res.status(401).json({ success: false, message: "User not found" });
      req.user = user;
      return next();
    }

    if (payload.userId) {
      const user = await User.findOne({ userId: payload.userId }).select("-password");
      if (!user) return res.status(401).json({ success: false, message: "User not found" });
      req.user = user;
      return next();
    }

    req.user = payload;
    next();
  } catch (err) {
    console.error("auth error:", err);
    return res.status(401).json({ success: false, message: "Invalid token" });
  }
}

module.exports = authMiddleware;
