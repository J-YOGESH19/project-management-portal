import { useState, useEffect } from "react";
import taskService from "../../services/taskService";
import aiService from "../../services/aiService";
import "./editmodal.css";

const SparkIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2l1.6 6.4L20 10l-6.4 1.6L12 18l-1.6-6.4L4 10l6.4-1.6L12 2Z" />
  </svg>
);

const CloseIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 6 6 18M6 6l12 12" />
  </svg>
);

const STATUS_OPTIONS = ["Pending", "In Progress", "Completed"];
const PRIORITY_OPTIONS = ["Low", "Medium", "High"];

const EditTaskModal = ({ task, onClose, onSaved }) => {
  const [formData, setFormData] = useState({ title: "", description: "", status: "Pending", priority: "Medium" });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [saving, setSaving] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);

  useEffect(() => {
    if (task) {
      setFormData({ title: task.title, description: task.description, status: task.status, priority: task.priority });
      setErrors({});
      setApiError("");
    }
  }, [task]);

  if (!task) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
    setApiError("");
  };

  const validate = () => {
    const next = {};
    if (!formData.title.trim()) next.title = "Title is required";
    if (!formData.description.trim()) next.description = "Description is required";
    else if (formData.description.trim().length < 20) next.description = "Min. 20 characters";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleGenerateDescription = async () => {
    if (!formData.title.trim()) { setErrors({ title: "Enter a title first" }); return; }
    setAiLoading(true);
    try {
      const description = await aiService.generateDescription(formData.title);
      setFormData((prev) => ({ ...prev, description }));
      setErrors((prev) => ({ ...prev, description: "" }));
    } catch { setApiError("Couldn't generate description. Try again."); }
    finally { setAiLoading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);
    setApiError("");
    try {
      await taskService.updateTask(task._id, formData);
      onSaved();
    } catch (err) {
      setApiError(err.response?.data?.message || "Failed to update task. Try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="pmp-modal-overlay" onClick={onClose}>
      <div className="pmp-modal" onClick={(e) => e.stopPropagation()}>

        <div className="pmp-modal-header">
          <h5 className="pmp-modal-title">Edit Task</h5>
          <button className="pmp-modal-close" onClick={onClose} aria-label="Close"><CloseIcon /></button>
        </div>

        {apiError && <div className="pmp-modal-error">{apiError}</div>}

        <form onSubmit={handleSubmit} noValidate>
          <div className="pmp-modal-body">

            <div className="pmp-form-field">
              <label htmlFor="edit-title">Title <span className="pmp-required">*</span></label>
              <input
                id="edit-title" name="title" type="text"
                className={`pmp-form-input ${errors.title ? "is-invalid" : ""}`}
                value={formData.title} onChange={handleChange}
                placeholder="Task title"
              />
              {errors.title && <span className="pmp-form-error">{errors.title}</span>}
            </div>

            <div className="pmp-form-field">
              <div className="pmp-form-label-row">
                <label htmlFor="edit-description">Description <span className="pmp-required">*</span></label>
                <button type="button" className="pmp-ai-btn" onClick={handleGenerateDescription} disabled={aiLoading}>
                  <SparkIcon /> {aiLoading ? "Generating..." : "Regenerate with AI"}
                </button>
              </div>
              <textarea
                id="edit-description" name="description" rows="4"
                className={`pmp-form-input pmp-form-textarea ${errors.description ? "is-invalid" : ""}`}
                value={formData.description} onChange={handleChange}
                placeholder="Describe what needs to be done..."
              />
              <div className="pmp-form-hint">
                <span className={formData.description.trim().length < 20 ? "pmp-hint-warn" : ""}>
                  {formData.description.trim().length}/20 min chars
                </span>
              </div>
              {errors.description && <span className="pmp-form-error">{errors.description}</span>}
            </div>

            <div className="pmp-form-row">
              <div className="pmp-form-field">
                <label htmlFor="edit-status">Status</label>
                <select id="edit-status" name="status" className="pmp-form-input pmp-form-select" value={formData.status} onChange={handleChange}>
                  {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="pmp-form-field">
                <label htmlFor="edit-priority">Priority</label>
                <select id="edit-priority" name="priority" className="pmp-form-input pmp-form-select" value={formData.priority} onChange={handleChange}>
                  {PRIORITY_OPTIONS.map((p) => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
            </div>

          </div>

          <div className="pmp-modal-footer">
            <button type="button" className="pmp-modal-cancel" onClick={onClose}>Cancel</button>
            <button type="submit" className="pmp-modal-save" disabled={saving}>
              {saving ? <span className="pmp-btn-spinner pmp-btn-spinner-dark" /> : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTaskModal;