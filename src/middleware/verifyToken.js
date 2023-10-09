const jwt = require("jsonwebtoken");

const verifyToken = async (req, res, next) => {
  try {
    const token = req.header("Authorization");

    if (!token) return res.status(403).json({ error: "Access Denied" });
    if (token.startsWith("Bearer ")) {
      const verified = jwt.verify(token.slice(7, token.length).trimLeft());
      req.user = verified;
      next();
    }
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};

module.exports = verifyToken;
