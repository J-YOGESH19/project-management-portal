const Task = require("../models/Task");
const logActivity = require("../utils/logActivity");

// @route  POST /api/tasks
const createTask = async (req, res) => {
  try {
    const { title, description, status, priority } = req.body;

    if (!title || !description) {
      return res.status(400).json({ message: "Title and description are required" });
    }

    const task = await Task.create({
      title,
      description,
      status,
      priority,
      userId: req.user._id,
    });

    await logActivity({
      userId: req.user._id,
      taskId: task._id,
      taskTitle: task.title,
      action: "created",
    });

    res.status(201).json(task);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @route  GET /api/tasks?search=&status=&sort=newest|oldest&page=&limit=
const getTasks = async (req, res) => {
  try {
    const { search, status, sort, page = 1, limit = 5 } = req.query;

    const query = { userId: req.user._id };

    if (status && status !== "All") {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    const sortOption = sort === "oldest" ? { createdAt: 1 } : { createdAt: -1 };

    const pageNum = Math.max(parseInt(page), 1);
    const limitNum = Math.max(parseInt(limit), 1);
    const skip = (pageNum - 1) * limitNum;

    const [tasks, total] = await Promise.all([
      Task.find(query).sort(sortOption).skip(skip).limit(limitNum),
      Task.countDocuments(query),
    ]);

    res.json({
      tasks,
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route  PUT /api/tasks/:id
const updateTask = async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, userId: req.user._id });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    const wasCompleted = task.status === "Completed";

    const { title, description, status, priority } = req.body;
    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (status !== undefined) task.status = status;
    if (priority !== undefined) task.priority = priority;

    const updatedTask = await task.save();

    const justCompleted = !wasCompleted && updatedTask.status === "Completed";

    await logActivity({
      userId: req.user._id,
      taskId: updatedTask._id,
      taskTitle: updatedTask.title,
      action: justCompleted ? "completed" : "updated",
    });

    res.json(updatedTask);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @route  DELETE /api/tasks/:id
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, userId: req.user._id });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    await task.deleteOne();

    await logActivity({
      userId: req.user._id,
      taskId: null,
      taskTitle: task.title,
      action: "deleted",
    });

    res.json({ message: "Task deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createTask, getTasks, updateTask, deleteTask };