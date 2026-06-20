import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import taskService from "../../services/taskService";
import aiService from "../../services/aiService";
import { SparkleIcon } from "../../components/icons";

const AddTask = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "Pending",
    priority: "Medium",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [breakdownLoading, setBreakdownLoading] = useState(false);
  const [subtasks, setSubtasks] = useState([]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleGenerateDescription = async () => {
    if (!formData.title.trim()) {
      setError("Enter a title first so AI knows what to describe");
      return;
    }
    setError("");
    setAiLoading(true);
    try {
      const description = await aiService.generateDescription(formData.title);
      setFormData((prev) => ({ ...prev, description }));
    } catch (err) {
      setError("Couldn't generate a description. Try again.");
    } finally {
      setAiLoading(false);
    }
  };

  const handleSuggestPriority = async () => {
    if (!formData.title.trim()) {
      setError("Enter a title first so AI can suggest a priority");
      return;
    }
    setError("");
    try {
      const priority = await aiService.recommendPriority(formData.title, formData.description);
      setFormData((prev) => ({ ...prev, priority }));
    } catch (err) {
      setError("Couldn't suggest a priority. Try again.");
    }
  };

  const handleBreakdown = async () => {
    if (!formData.title.trim()) {
      setError("Enter a title first so AI can break it into subtasks");
      return;
    }
    setError("");
    setBreakdownLoading(true);
    try {
      const result = await aiService.breakdownTask(formData.title);
      setSubtasks(result);
    } catch (err) {
      setError("Couldn't generate subtasks. Try again.");
    } finally {
      setBreakdownLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.description.trim().length < 20) {
      setError("Description must be at least 20 characters");
      return;
    }

    setLoading(true);
    try {
      await taskService.createTask(formData);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create task. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const descLen = formData.description.length;

  return (
    <div className="pmp-page" style={{ maxWidth: "680px" }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="pmp-page-title mb-0">Add Task</h3>
        <Link to="/dashboard" className="pmp-back-link">Back to Dashboard</Link>
      </div>

      <div className="pmp-form-card">
        {error && <div className="pmp-alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="pmp-form-group">
            <label className="pmp-form-label">Title</label>
            <input
              type="text"
              name="title"
              className="pmp-control"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Redesign onboarding flow"
              required
            />
          </div>

          <div className="pmp-form-group">
            <div className="pmp-form-row">
              <label className="pmp-form-label">Description</label>
              <button
                type="button"
                className="pmp-btn-ai pmp-btn-ai-inline"
                onClick={handleGenerateDescription}
                disabled={aiLoading}
              >
                <SparkleIcon size={13} />
                {aiLoading ? "Generating..." : "Generate with AI"}
              </button>
            </div>
            <textarea
              name="description"
              className="pmp-textarea"
              rows="4"
              value={formData.description}
              onChange={handleChange}
              placeholder="What does this task involve?"
              required
            />
            <div className={`pmp-helper-text ${descLen >= 20 ? "is-valid" : ""}`}>
              Minimum 20 characters ({descLen}/20)
            </div>
          </div>

          <div className="pmp-form-grid-2">
            <div className="pmp-form-group">
              <label className="pmp-form-label">Status</label>
              <select
                name="status"
                className="pmp-control"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>

            <div className="pmp-form-group">
              <div className="pmp-form-row">
                <label className="pmp-form-label">Priority</label>
                <button
                  type="button"
                  className="pmp-ai-link"
                  onClick={handleSuggestPriority}
                >
                  AI Suggest
                </button>
              </div>
              <select
                name="priority"
                className="pmp-control"
                value={formData.priority}
                onChange={handleChange}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
          </div>

          <div className="pmp-form-group">
            <button
              type="button"
              className="pmp-btn-ai"
              onClick={handleBreakdown}
              disabled={breakdownLoading}
            >
              <SparkleIcon size={14} />
              {breakdownLoading ? "Breaking down..." : "Break into Subtasks (AI)"}
            </button>

            {subtasks.length > 0 && (
              <div className="pmp-subtasks-panel">
                <p className="pmp-subtasks-note">Suggested subtasks — for your own planning, not saved:</p>
                <ul className="pmp-subtasks-list">
                  {subtasks.map((sub, i) => (
                    <li key={i}>
                      <span className="pmp-subtasks-bullet" />
                      {sub}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <button type="submit" className="pmp-btn-block" disabled={loading}>
            {loading ? "Creating..." : "Create Task"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddTask;