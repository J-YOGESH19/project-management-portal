const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    task: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
      default: null, // stays null if the task was later deleted
    },
    taskTitle: {
      type: String, // snapshot, so the timeline still reads fine after deletion
      required: true,
    },
    action: {
      type: String,
      enum: ["created", "updated", "completed", "deleted"],
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Activity", activitySchema);