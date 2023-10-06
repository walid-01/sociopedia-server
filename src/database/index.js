const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

// console.log(process.env.MONGO_URI);

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  // .then(() => console.log("Connected to DB"))
  .catch((err) => console.log(err));
