const jwt = require("jsonwebtoken");

const verifyToken = async (req, res, next) => {
  try {
    const token = req.header("Authorization");

    if (!token) return res.status(403).json({ error: "Access Denied" });
    if (token.startsWith("Bearer ")) {
      const verified = jwt.verify(
        token.slice(7, token.length),
        process.env.ACCESS_TOKEN_SECRET
      );
      req.user = verified;
      return next();
    }
    return res.status(403).json({ error: "Access Denied" });
  } catch (err) {
    if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError")
      return res.status(401).json({ error: err.message });

    console.log(err);
    res.status(500).json(err);
  }
};

module.exports = verifyToken;
