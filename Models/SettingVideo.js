const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  resolution: {
    type: String,
    required: true,
  },
  VideoDelay: {
    type: Number,
    required: true,
  },
  format: {
    type: String,
    required: true,
  },
});

const model =
  mongoose.models.SettingVideo || mongoose.model("SettingVideo", schema);

module.exports = model;
