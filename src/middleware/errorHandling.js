// Error handling middleware
const errorHandler = (err, req, res, next) => {
  console.error(err); // Log the error for debugging purposes

  // Handle specific error types, such as validation errors
  if (err.name === "ValidationError") {
    return res
      .status(400)
      .json({ error: Object.values(err.errors).map((error) => error.message) });
  }

  // Handle specific error types, such as CastError (invalid ObjectId)
  if (err.name === "CastError") {
    return res.status(400).json({ error: "Invalid ID" });
  }

  // Handle other types of errors
  res.status(500).json({ error: "Internal server error" });
};

module.exports = errorHandler;
