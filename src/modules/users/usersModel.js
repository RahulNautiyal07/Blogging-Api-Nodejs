const mongoose = require("mongoose");
let userSchema = new mongoose.Schema({
  user_id: {
    type: Number,
  },
  first_name: {
    type: String,
    required: [true, "No building name provided"],
  },
  last_name: {
    type: String,
    required: [true, "No building name provided"],
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    unique: true,
    validate: {
      validator: function (v) {
        return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
      },
      message: "Please enter a valid email",
    },
    index: {
      unique: true,
    },
    required: [true, "No email provided"],
  },
  password: {
    type: String,
  },
  is_active: {
    type: Boolean,
    default: true,
  },
  access_token: {
    type: String,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  update_at: {
    type: Date,
    default: Date.now,
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
},
  

});
userSchema.index({ first_name : 'text', email : 'text', _id: 'text', role: 'text' });

var userModal = mongoose.model("user", userSchema, "users");
module.exports = userModal;
