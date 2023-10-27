const checkNotAuthenticated = (req, res, next) => {
  const token = req.header("Authorization");
  if (token) {
    // User is authenticated, you can handle the response accordingly
    return res
      .status(500)
      .json({ error: "Already logged in, Route /home not finished yet" });
  }

  // User is not authenticated, continue to the next middleware or route handler
  next();
};

module.exports = { checkNotAuthenticated };
