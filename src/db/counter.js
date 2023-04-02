const mongoose = require("mongoose");

let counterSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  sequence_value: {
    type: Number,
  }
  
});

var postModal = mongoose.model("counter", counterSchema, "counters");
module.exports = postModal;
