import TaskCard from "../TaskCard";
import { Link } from "react-router-dom";

const TaskList = ({ tasks, onComplete, onDelete, onEdit }) => {
  if (tasks.length === 0) {
    return (
      <div className="pmp-empty">
        <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.3, marginBottom: "0.75rem" }}>
          <rect x="3" y="3" width="18" height="18" rx="3" />
          <path d="M9 12h6M12 9v6" />
        </svg>
        <p style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 600, marginBottom: "0.35rem" }}>No tasks yet</p>
        <p style={{ fontSize: "0.85rem", marginBottom: "1rem" }}>Create your first task to get started</p>
        <Link to="/add-task" style={{
          display: "inline-flex", alignItems: "center", gap: "6px",
          padding: "0.5rem 1.1rem", borderRadius: "9px",
          background: "var(--pmp-navy-950)", color: "#fff",
          fontSize: "0.85rem", fontWeight: 600, textDecoration: "none",
          transition: "background 0.15s"
        }}>
          + Add Task
        </Link>
      </div>
    );
  }

  return (
    <div>
      {tasks.map((task) => (
        <TaskCard key={task._id} task={task} onComplete={onComplete} onDelete={onDelete} onEdit={onEdit} />
      ))}
    </div>
  );
};

export default TaskList;