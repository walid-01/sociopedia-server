const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const mongoose = require("mongoose");
// const mongoStore = require("connect-mongo");
// const session = require("express-session");

const authRoute = require("./routes/auth");
const userRoute = require("./routes/user");

dotenv.config();

const app = express();

app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(express.json());
app.use(cors());

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  // .then(() => console.log("Connected to DB"))
  .catch((err) => console.log(err));

// Routes
app.use("/auth", authRoute);
app.use("/user", userRoute);

const port = process.env.PORT || 3001;
app.listen(port, () => {
  // console.log(`App listening on port: ${port}`);
});
