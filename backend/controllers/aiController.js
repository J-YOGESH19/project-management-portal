const { GoogleGenAI } = require("@google/genai");
const Task = require("../models/Task");

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const MODEL = "gemini-2.5-flash";

const askGemini = async (prompt) => {
  const response = await ai.models.generateContent({ model: MODEL, contents: prompt });
  return response.text.trim();
};

// ---- fallback (rule-based) logic, used only if the Gemini call fails ----
const KEYWORDS = {
  auth: ["login", "auth", "signup", "register", "password"],
  ui: ["page", "ui", "design", "layout", "form", "dashboard"],
  api: ["api", "endpoint", "backend", "server", "route"],
  bug: ["fix", "bug", "error", "crash", "fail", "failure", "issue", "down", "broken"],
  urgent: ["urgent", "critical", "security", "payment", "production"],
};
const matchesAny = (text, list) => list.some((w) => text.toLowerCase().includes(w));

const fallbackDescription = (title) =>
  `Plan and implement ${title.toLowerCase()}, ensuring proper testing, clean code structure, and documentation.`;

const fallbackSubtasks = (title) => [
  "Research and plan approach",
  "Implement core functionality",
  "Handle edge cases",
  "Write tests",
  "Review and refine",
];

const fallbackPriority = (text) => {
  if (matchesAny(text, KEYWORDS.bug) || matchesAny(text, KEYWORDS.urgent)) return "High";
  return "Medium";
};

// ---- AI Task Description Generator ----
const generateDescription = async (req, res) => {
  const { title } = req.body;
  if (!title) return res.status(400).json({ message: "Title is required" });

  try {
    const prompt = `Write one professional, concise task description (1-2 sentences, at least 20 characters) for a project management tool, based on this task title: "${title}". Output ONLY the description text — no labels, no quotes, no markdown.`;
    const description = await askGemini(prompt);
    res.json({ description });
  } catch (error) {
    console.error("Gemini error (description):", error.message);
    res.json({ description: fallbackDescription(title) });
  }
};

// ---- AI Task Breakdown Assistant ----
const breakdownTask = async (req, res) => {
  const { title } = req.body;
  if (!title) return res.status(400).json({ message: "Title is required" });

  try {
    const prompt = `Break the task "${title}" into 4-6 short, actionable subtasks for a project management tool. Respond ONLY with a valid JSON array of strings — no markdown, no code fences, no explanation. Example: ["Step one", "Step two"]`;
    const raw = await askGemini(prompt);
    const cleaned = raw.replace(/```json|```/g, "").trim();
    const subtasks = JSON.parse(cleaned);
    res.json({ subtasks });
  } catch (error) {
    console.error("Gemini error (breakdown):", error.message);
    res.json({ subtasks: fallbackSubtasks(title) });
  }
};

// ---- AI Priority Recommendation ----
const recommendPriority = async (req, res) => {
  const { title = "", description = "" } = req.body;

  try {
    const prompt = `Task title: "${title}". Description: "${description}". Respond with exactly one word — Low, Medium, or High — representing the recommended priority for a project management tool. Output ONLY that one word.`;
    const raw = await askGemini(prompt);
    const cleaned = raw.replace(/[^a-zA-Z]/g, "");
    const valid = ["Low", "Medium", "High"];
    const priority = valid.find((p) => p.toLowerCase() === cleaned.toLowerCase()) || "Medium";
    res.json({ priority });
  } catch (error) {
    console.error("Gemini error (priority):", error.message);
    res.json({ priority: fallbackPriority(`${title} ${description}`) });
  }
};

// ---- AI Productivity Insights ----
const getInsights = async (req, res) => {
  try {
    const userId = req.user._id;

    const [pending, inProgress, completed] = await Promise.all([
      Task.countDocuments({ userId, status: "Pending" }),
      Task.countDocuments({ userId, status: "In Progress" }),
      Task.countDocuments({ userId, status: "Completed" }),
    ]);

    const pendingTasks = await Task.find({ userId, status: "Pending" })
      .sort({ createdAt: 1 })
      .limit(5);

    let suggestion;
    if (pendingTasks.length === 0) {
      suggestion = "No pending tasks right now — nice work staying on top of things.";
    } else {
      try {
        const taskList = pendingTasks.map((t) => `"${t.title}" (priority: ${t.priority})`).join(", ");
        const prompt = `A user has these pending tasks: ${taskList}. In one short, encouraging sentence, tell them which task to focus on next and briefly why. Output ONLY that sentence.`;
        suggestion = await askGemini(prompt);
      } catch (error) {
        console.error("Gemini error (insights):", error.message);
        suggestion = `Focus on completing "${pendingTasks[0].title}".`;
      }
    }

    res.json({
      pending,
      inProgress,
      completed,
      message: `You currently have ${pending} pending task${pending !== 1 ? "s" : ""}.`,
      suggestion,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { generateDescription, breakdownTask, recommendPriority, getInsights };