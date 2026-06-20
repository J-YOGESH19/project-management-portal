const express = require("express");
const router = express.Router();
const {
  generateDescription,
  breakdownTask,
  recommendPriority,
  getInsights,
} = require("../controllers/aiController");
const { protect } = require("../middleware/authMiddleware");

router.use(protect);

router.post("/generate-description", generateDescription);
router.post("/breakdown", breakdownTask);
router.post("/priority", recommendPriority);
router.get("/insights", getInsights);

module.exports = router;