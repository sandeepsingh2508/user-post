const mongoose = require("mongoose");

const userAuthSchema = mongoose.Schema(
  {
    userName: {
      type: String,
    },
    email: {
      type: String,
    },
    password: {
      type: String,
    },
  },
  { timestamps: true }
);
const userAuthModel = mongoose.model("User-Auth", userAuthSchema);

module.exports = userAuthModel;
