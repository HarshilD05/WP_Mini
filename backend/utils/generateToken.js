const jwt = require("jsonwebtoken");

function generateToken(user) {
  return jwt.sign(
    { 
      _id: user._id, 
      userId: user.userId, 
      role: user.role 
    },
    process.env.ACCESS_TOKEN_SECRET,
    { 
      expiresIn: "7d" 
    }
  );
}


module.exports = generateToken;
