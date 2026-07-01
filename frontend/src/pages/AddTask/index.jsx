import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import taskService from "../../services/taskService";
import aiService from "../../services/aiService";
import "./addtask.css";

const SparkIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2l1.6 6.4L20 10l-6.4 1.6L12 18l-1.6-6.4L4 10l6.4-1.6L12 2Z" />
  </svg>
);

const PuzzleIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.5 14.5a2 2 0 0 0 0-4v-3a1 1 0 0 0-1-1h-3a2 2 0 0 0-4 0H9.5a1 1 0 0 0-1 1v3a2 2 0 0 0 0 4v3a1 1 0 0 0 1 1H13a2 2 0 0 0 4 0h3a1 1 0 0 0 1-1v-3Z" />
  </svg>
);

const BackIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 12H5M12 5l-7 7 7 7" />
  </svg>
);

const STATUS_OPTIONS = ["Pending", "In Progress", "Completed"];
const PRIORITY_OPTIONS = ["Low", "Medium", "High"];

const AddTask = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "", description: "", status: "Pending", priority: "Medium",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [aiDescLoading, setAiDescLoading] = useState(false);
  const [breakdownLoading, setBreakdownLoading] = useState(false);
  const [priorityLoading, setPriorityLoading] = useState(false);
  const [subtasks, setSubtasks] = useState([]);
  const [apiError, setApiError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
    setApiError("");
  };

  const validate = () => {
    const next = {};
    if (!formData.title.trim()) next.title = "Title is required";
    if (!formData.description.trim()) next.description = "Description is required";
    else if (formData.description.trim().length < 20) next.description = "Description must be at least 20 characters";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleGenerateDescription = async () => {
    if (!formData.title.trim()) { setErrors({ title: "Enter a title first" }); return; }
    setAiDescLoading(true);
    try {
      const description = await aiService.generateDescription(formData.title);
      setFormData((prev) => ({ ...prev, description }));
      setErrors((prev) => ({ ...prev, description: "" }));
    } catch { setApiError("Couldn't generate description. Try again."); }
    finally { setAiDescLoading(false); }
  };

  const handleBreakdown = async () => {
    if (!formData.title.trim()) { setErrors({ title: "Enter a title first" }); return; }
    setBreakdownLoading(true);
    try {
      const result = await aiService.breakdownTask(formData.title);
      setSubtasks(result);
    } catch { setApiError("Couldn't generate subtasks. Try again."); }
    finally { setBreakdownLoading(false); }
  };

  const handleSuggestPriority = async () => {
    if (!formData.title.trim()) { setErrors({ title: "Enter a title first" }); return; }
    setPriorityLoading(true);
    try {
      const priority = await aiService.recommendPriority(formData.title, formData.description);
      setFormData((prev) => ({ ...prev, priority }));
    } catch { setApiError("Couldn't suggest priority. Try again."); }
    finally { setPriorityLoading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setApiError("");
    try {
      await taskService.createTask(formData);
      navigate("/dashboard");
    } catch (err) {
      setApiError(err.response?.data?.message || "Failed to create task. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const descLen = formData.description.trim().length;

  return (
    <div className="pmp-page">
      <div className="pmp-addtask-wrap">
        <div className="pmp-addtask-header">
          <div>
            <h3 className="pmp-page-title mb-0">Add Task</h3>
            <p className="pmp-addtask-sub">Fill in the details or let AI help you out</p>
          </div>
          <Link to="/dashboard" className="pmp-back-btn">
            <BackIcon /> Back
          </Link>
        </div>

        {apiError && <div className="pmp-alert-error">{apiError}</div>}

        <form onSubmit={handleSubmit} noValidate>
          <div className="pmp-addtask-grid">

            {/* ---- Left column: main fields ---- */}
            <div className="pmp-addtask-main">
              <div className="pmp-form-card">
                <h6 className="pmp-form-section-title">Task Details</h6>

                <div className="pmp-form-field">
                  <label htmlFor="title">Title <span className="pmp-required">*</span></label>
                  <input
                    id="title" name="title" type="text"
                    className={`pmp-form-input ${errors.title ? "is-invalid" : ""}`}
                    value={formData.title} onChange={handleChange}
                    placeholder="e.g. Build login page"
                  />
                  {errors.title && <span className="pmp-form-error">{errors.title}</span>}
                </div>

                <div className="pmp-form-field">
                  <div className="pmp-form-label-row">
                    <label htmlFor="description">
                      Description <span className="pmp-required">*</span>
                    </label>
                    <button type="button" className="pmp-ai-btn" onClick={handleGenerateDescription} disabled={aiDescLoading}>
                      <SparkIcon /> {aiDescLoading ? "Generating..." : "Generate with AI"}
                    </button>
                  </div>
                  <textarea
                    id="description" name="description" rows="5"
                    className={`pmp-form-input pmp-form-textarea ${errors.description ? "is-invalid" : ""}`}
                    value={formData.description} onChange={handleChange}
                    placeholder="Describe what needs to be done..."
                  />
                  <div className="pmp-form-hint">
                    <span className={descLen > 0 && descLen < 20 ? "pmp-hint-warn" : ""}>{descLen}/20 min chars</span>
                  </div>
                  {errors.description && <span className="pmp-form-error">{errors.description}</span>}
                </div>

                <div className="pmp-form-row">
                  <div className="pmp-form-field">
                    <label htmlFor="status">Status</label>
                    <select id="status" name="status" className="pmp-form-input pmp-form-select" value={formData.status} onChange={handleChange}>
                      {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>

                  <div className="pmp-form-field">
                    <div className="pmp-form-label-row">
                      <label htmlFor="priority">Priority</label>
                      <button type="button" className="pmp-ai-link" onClick={handleSuggestPriority} disabled={priorityLoading}>
                        {priorityLoading ? "Thinking..." : "✦ AI Suggest"}
                      </button>
                    </div>
                    <select id="priority" name="priority" className="pmp-form-input pmp-form-select" value={formData.priority} onChange={handleChange}>
                      {PRIORITY_OPTIONS.map((p) => <option key={p} value={p}>{p}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              <button type="submit" className="pmp-submit-btn" disabled={loading}>
                {loading ? <span className="pmp-btn-spinner" /> : "Create Task"}
              </button>
            </div>

            {/* ---- Right column: AI breakdown ---- */}
            <div className="pmp-addtask-side">
              <div className="pmp-form-card pmp-ai-breakdown-card">
                <h6 className="pmp-form-section-title pmp-ai-title">
                  <SparkIcon /> AI Breakdown
                </h6>
                <p className="pmp-breakdown-desc">
                  Enter a title and let AI suggest subtasks to scope your work before creating the task.
                </p>
                <button type="button" className="pmp-breakdown-btn" onClick={handleBreakdown} disabled={breakdownLoading}>
                  <PuzzleIcon />
                  {breakdownLoading ? "Breaking down..." : "Break into Subtasks"}
                </button>

                {subtasks.length > 0 && (
                  <ul className="pmp-subtask-list">
                    {subtasks.map((sub, i) => (
                      <li key={i} className="pmp-subtask-item">
                        <span className="pmp-subtask-num">{i + 1}</span>
                        {sub}
                      </li>
                    ))}
                  </ul>
                )}

                {subtasks.length === 0 && (
                  <div className="pmp-breakdown-empty">
                    <PuzzleIcon />
                    <span>Subtasks will appear here</span>
                  </div>
                )}

                <p className="pmp-breakdown-note">These are planning suggestions — they won't be saved as separate tasks.</p>
              </div>
            </div>

          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTask;