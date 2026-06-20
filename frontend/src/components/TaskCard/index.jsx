const STATUS_BADGE = { Pending: "pmp-badge-pending", "In Progress": "pmp-badge-progress", Completed: "pmp-badge-completed" };
const PRIORITY_BADGE = { Low: "pmp-badge-low", Medium: "pmp-badge-medium", High: "pmp-badge-high" };

const TaskCard = ({ task, onComplete, onDelete, onEdit }) => {
  const isCompleted = task.status === "Completed";

  return (
    <div className="pmp-task-card">
      <div className="d-flex justify-content-between align-items-start gap-2 mb-2">
        <h5 className={`pmp-task-title ${isCompleted ? "is-completed" : ""}`}>{task.title}</h5>
        <div className="d-flex gap-2 flex-shrink-0">
          <span className={`pmp-badge ${STATUS_BADGE[task.status]}`}>{task.status}</span>
          <span className={`pmp-badge ${PRIORITY_BADGE[task.priority]}`}>{task.priority}</span>
        </div>
      </div>

      <p className="pmp-task-desc">{task.description}</p>

      <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
        <span className="pmp-task-date">{new Date(task.createdAt).toLocaleDateString()}</span>
        <div className="d-flex gap-2">
          {!isCompleted && (
            <button className="pmp-btn-sm pmp-btn-sm-success" onClick={() => onComplete(task._id)}>✓ Complete</button>
          )}
          <button className="pmp-btn-sm pmp-btn-sm-outline" onClick={() => onEdit(task)}>Edit</button>
          <button className="pmp-btn-sm pmp-btn-sm-danger" onClick={() => onDelete(task._id)}>Delete</button>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;