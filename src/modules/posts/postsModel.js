const mongoose = require("mongoose");

const opts = {
  timestamps: {
    createdAt: "created_at",
    updatedAt: "updated_at",
  },
};

let postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "No name provided"],
  },
  description: {
    type: String,
    required: [true, "No description provided"],
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  is_active: {
    type: Boolean,
    default: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  update_at: {
    type: Date,
    default: Date.now,
  },
});

var postModal = mongoose.model("post", postSchema, "posts");
module.exports = postModal;
