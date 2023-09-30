const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    firstName: {
      type: mongoose.SchemaTypes.String,
      required: true,
      min: 2,
      max: 20,
    },
    lastName: {
      type: mongoose.SchemaTypes.String,
      required: true,
      min: 2,
      max: 20,
    },
    friends: {
      type: mongoose.SchemaTypes.Array,
    },
    email: {
      type: mongoose.SchemaTypes.String,
      required: true,
      uniqe: true,
      max: 50,
    },
    password: {
      type: mongoose.SchemaTypes.String,
      required: true,
      min: 8,
      max: 30,
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
      required: true,
      default: 0,
    },
    impressions: {
      type: mongoose.SchemaTypes.Number,
      required: true,
      default: 0,
    },
  }
  // { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
