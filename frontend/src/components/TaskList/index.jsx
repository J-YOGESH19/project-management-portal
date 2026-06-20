import TaskCard from "../TaskCard";

const TaskList = ({ tasks, onComplete, onDelete, onEdit }) => {
  if (tasks.length === 0) {
    return (
      <div className="pmp-empty">
        <p className="mb-0">No tasks found.</p>
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