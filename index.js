const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
// const multer = require("multer");
const helmet = require("helmet");
const morgan = require("morgan");
// const path = require("path");

const auth = require("./routes/auth");

dotenv.config();

const app = express();

app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(express.json());
// app.use(express.urlencoded());
app.use(cors());
// app.use("/assests", express.static(path.join(__dirname, "public/assests")));

// Mongoose
const PORT = process.env.PORT;
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  // .then(() => console.log("Connected to DB"))
  .catch((err) => console.log(err));

// Routes
app.use("/auth", auth);

app.listen(PORT);
