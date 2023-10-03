const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const passport = require("passport");
const mongoStore = require("connect-mongo");
const session = require("express-session");

const auth = require("./routes/auth");

require("./strategies/local");

dotenv.config();

const app = express();

app.use(
  session({
    secret: "ifgaf15agf4agafg743a2faf47afgh4jtr",
    resave: false,
    saveUninitialized: false,
    store: mongoStore.create({
      mongoUrl: "mongodb://127.0.0.1:27017/sociopedia",
    }),
  })
);

app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(express.json());
app.use(cors());
app.use(passport.initialize());
app.use(passport.session());

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
