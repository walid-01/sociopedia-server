const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    firstName: {
      type: mongoose.SchemaTypes.String,
      required: true,
      minlength: 2,
      maxlength: 20,
    },
    lastName: {
      type: mongoose.SchemaTypes.String,
      required: true,
      minlength: 2,
      maxlength: 20,
    },
    friends: {
      type: mongoose.SchemaTypes.Array,
    },
    email: {
      type: mongoose.SchemaTypes.String,
      required: true,
      unique: true,
      maxlength: 50,
    },
    password: {
      type: mongoose.SchemaTypes.String,
      required: true,
      minlength: 8,
      maxlength: 100,
    },
    picturePath: {
      type: mongoose.SchemaTypes.String,
      default: "",
    },
    location: {
      type: mongoose.SchemaTypes.String,
    },
    occupation: {
      type: mongoose.SchemaTypes.String,
    },
    viewedProfile: {
      type: mongoose.SchemaTypes.Number,
      default: 0,
    },
    impressions: {
      type: mongoose.SchemaTypes.Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
