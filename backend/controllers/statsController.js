const Task = require("../models/Task");

// @route  GET /api/tasks/stats
const getStats = async (req, res) => {
  try {
    const userId = req.user._id;

    const [total, pending, inProgress, completed] = await Promise.all([
      Task.countDocuments({ userId }),
      Task.countDocuments({ userId, status: "Pending" }),
      Task.countDocuments({ userId, status: "In Progress" }),
      Task.countDocuments({ userId, status: "Completed" }),
    ]);

    res.json({ total, pending, inProgress, completed });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getStats };