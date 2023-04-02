const mongoose = require("mongoose");

const opts = {
  timestamps: {
    createdAt: "created_at",
    updatedAt: "updated_at",
  },
};

let todoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "No name provided"],
  },
  description: {
    type: String,
    trim: true,
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  is_completed: {
    type: Boolean,
    default: false,
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
  }
});

var todoModal = mongoose.model("todo", todoSchema, "todos");
module.exports = todoModal;
