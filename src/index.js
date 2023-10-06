const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const passport = require("passport");
const mongoStore = require("connect-mongo");
const session = require("express-session");

const auth = require("./routes/auth");
require("./database");

require("./strategies/local");

dotenv.config();

const app = express();

app.use(
  session({
    secret: "ifgaf15agf4agafg743a2faf47afgh4jtr",
    resave: false,
    saveUninitialized: false,
    store: mongoStore.create({
      mongoUrl: process.env.MONGO_URI,
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

// Routes
app.use("/auth", auth);

const port = process.env.PORT || 3001;
app.listen(port, () => {
  // console.log(`App listening on port: ${port}`);
});
