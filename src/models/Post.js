const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
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
    // location: {
    //   type: mongoose.SchemaTypes.String,
    //   maxlength: 30,
    // },
    description: {
      type: mongoose.SchemaTypes.String,
      maxlength: 100,
    },
    picutrePath: {
      type: mongoose.SchemaTypes.String,
      required: true,
    },
    likes: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      ],
      default: [],
    },
    comments: {
      type: [
        {
          user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
          },
          text: {
            type: String,
            required: true,
          },
        },
      ],
      default: [],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", PostSchema);
