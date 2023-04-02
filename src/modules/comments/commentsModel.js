const mongoose = require("mongoose");

const opts = {
  timestamps: {
    createdAt: "created_at",
    updatedAt: "updated_at",
  },
};

let commentSchema = new mongoose.Schema({
  description: {
    type: String,
    required: [true, "No description provided"],
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  post_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "post",
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

var commentModal = mongoose.model("comment", commentSchema, "comments");
module.exports = commentModal;
