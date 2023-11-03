const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const mongoose = require("mongoose");

const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const postRoutes = require("./routes/post");
const errorHandler = require("./middleware/errorHandler");

const verifyToken = require("./middleware/verifyToken");
const { checkNotAuthenticated } = require("./middleware/checkNotAuthenticated");

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
app.use("/auth", checkNotAuthenticated, authRoutes);
app.use("/user", verifyToken, userRoutes);
app.use("/post", verifyToken, postRoutes);

app.use(errorHandler);

const port = process.env.PORT || 3001;
app.listen(port) /*, () => console.log(`App listening on port: ${port}`))*/;
