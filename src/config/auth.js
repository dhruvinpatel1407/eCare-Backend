const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const generateToken = (user) => {
  return jwt.sign(
    {
      userId: user._id,
      userName: user.userName,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "1h",
    }
  );
};

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(403).json({ error: "No token provided" });
  }

  // Remove "Bearer " prefix if it exists
  const tokenValue = token.startsWith("Bearer ") ? token.slice(7) : token;

  jwt.verify(tokenValue, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: "Invalid token" });
    }
    req.user = decoded; // Add the decoded user to the request
    next();
  });
};

module.exports = {
  generateToken,
  verifyToken,
};
