const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  let token = req.header("Authorization");

  if (!token) return res.status(401).json({ message: "No token provided" });
  
  token = token.startsWith("Bearer ") ? token.replace("Bearer ", "") : token;

  try {
    const secretKey = process.env.JWT_SECRET || "defaultSecret";
    const decoded = jwt.verify(token, secretKey);
    console.log(decoded);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = authMiddleware;
