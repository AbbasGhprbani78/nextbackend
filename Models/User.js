const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  userName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },

  password: {
    type: String,
    required: true,
  },

  role: {
    type: String,
    required: true,
  },

  // resetCode: {
  //   type: String,
  // },

  // resetCodeExpiration: {
  //   type: Date,
  // },
  refreshToken: String,
});

const model = mongoose.models.User || mongoose.model("User", schema);

module.exports = model;
