const Activity = require("../models/Activity");

/**
 * Creates an activity log entry.
 * taskTitle is stored as a snapshot so the timeline still
 * reads correctly even after a task is deleted.
 */
const logActivity = async ({ userId, taskId = null, taskTitle, action }) => {
  try {
    await Activity.create({
      user: userId,
      task: taskId,
      taskTitle,
      action,
    });
  } catch (error) {
    // Don't let a logging failure break the main request
    console.error("Activity log error:", error.message);
  }
};

module.exports = logActivity;