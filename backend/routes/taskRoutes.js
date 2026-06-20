const express = require("express");
const router = express.Router();
const { createTask, getTasks, updateTask, deleteTask } = require("../controllers/taskController");
const { protect } = require("../middleware/authMiddleware");

router.use(protect); // every route below requires a valid token

router.post("/", createTask);
router.get("/", getTasks);
router.put("/:id", updateTask);
router.delete("/:id", deleteTask);
const { getStats } = require("../controllers/statsController");
// ...
router.get("/stats", getStats);
module.exports = router;