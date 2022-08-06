const { Schema, model } = require("mongoose");

const shortenUrlSchema = new Schema({
  full: {
    type: String,
    required: true,
  },

  short: {
    type: String,
    required: true,
  },

  clicks: {
    type: Number,
    required: true,
    default: 0,
  },
});

module.exports = model("ShortUrl", shortenUrlSchema);
