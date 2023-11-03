// Error handling middleware
const errorHandler = (err, req, res, next) => {
  // validation errors
  if (err.name === "ValidationError") {
    return res
      .status(400)
      .json({ error: Object.values(err.errors).map((error) => error.message) });
  }

  // CastError
  if (err.name === "CastError") {
    return res.status(400).json({ error: "Invalid ID" });
  }

  // Unique email error
  if (err.code === 11000)
    return res.status(400).json({ error: "Email already exists" });

  console.error("Unhandled Error --------------------------------");
  console.error(err); // Log the error for debugging purposes
  // Handle other types of errors
  res.status(500).json({ error: "Internal server error" });
};

module.exports = errorHandler;
