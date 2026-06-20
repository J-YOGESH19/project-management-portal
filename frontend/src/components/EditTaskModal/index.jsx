import { useState, useEffect } from "react";
import taskService from "../../services/taskService";
import aiService from "../../services/aiService";

const EditTaskModal = ({ task, onClose, onSaved }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "Pending",
    priority: "Medium",
  });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority,
      });
    }
  }, [task]);

  if (!task) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleGenerateDescription = async () => {
    if (!formData.title.trim()) return;
    setAiLoading(true);
    try {
      const description = await aiService.generateDescription(formData.title);
      setFormData((prev) => ({ ...prev, description }));
    } catch (err) {
      setError("Couldn't generate a description.");
    } finally {
      setAiLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.description.trim().length < 20) {
      setError("Description must be at least 20 characters");
      return;
    }

    setSaving(true);
    try {
      await taskService.updateTask(task._id, formData);
      onSaved();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update task");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
      style={{ background: "rgba(0,0,0,0.5)", zIndex: 1050 }}
      onClick={onClose}
    >
      <div
        className="card border-0 shadow-lg"
        style={{ width: "100%", maxWidth: "520px", margin: "1rem" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="card-body p-4">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="fw-bold mb-0">Edit Task</h5>
            <button className="btn-close" onClick={onClose}></button>
          </div>

          {error && <div className="alert alert-danger py-2">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Title</label>
              <input
                type="text"
                name="title"
                className="form-control"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <div className="d-flex justify-content-between align-items-center">
                <label className="form-label mb-0">Description</label>
                <button
                  type="button"
                  className="btn btn-sm btn-outline-primary"
                  onClick={handleGenerateDescription}
                  disabled={aiLoading}
                >
                  {aiLoading ? "Generating..." : "✨ Regenerate with AI"}
                </button>
              </div>
              <textarea
                name="description"
                className="form-control mt-2"
                rows="4"
                value={formData.description}
                onChange={handleChange}
                required
              />
            </div>

            <div className="row">
              <div className="col-6 mb-3">
                <label className="form-label">Status</label>
                <select
                  name="status"
                  className="form-select"
                  value={formData.status}
                  onChange={handleChange}
                >
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>

              <div className="col-6 mb-3">
                <label className="form-label">Priority</label>
                <select
                  name="priority"
                  className="form-select"
                  value={formData.priority}
                  onChange={handleChange}
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>
            </div>

            <div className="d-flex gap-2">
              <button type="button" className="btn btn-outline-secondary flex-fill" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary flex-fill" disabled={saving}>
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditTaskModal;