const { Strategy } = require("passport-local");
const passport = require("passport");
const User = require("../database/models/User");
const bcrypt = require("bcrypt");

passport.serializeUser((user, done) => {
  console.log("Serializing user");
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  console.log("Deserializing User");
  try {
    const userDB = await User.findById(id);
    if (!userDB) done(null, null);
    else done(null, userDB);
  } catch (err) {
    console.error(err);
    done(err, null);
  }
});

passport.use(
  new Strategy(
    {
      usernameField: "email",
    },
    async (email, password, done) => {
      try {
        const userDB = await User.findOne({ email });
        if (!userDB) {
          console.log("No user with the specified email was found");
          done(new Error("No user with the specified email was found"), null);
        } else {
          const isPasswordValid = await bcrypt.compare(
            password,
            userDB.password
          );
          if (isPasswordValid) {
            console.log("Authenticated successfuly");
            done(null, userDB);
          } else {
            console.log("Wrong password");
            done(new Error("Wrong password"), null);
          }
        }
      } catch (err) {
        console.log(err);
        done(err, null);
      }
    }
  )
);
