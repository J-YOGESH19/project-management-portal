import { useState, useEffect } from "react";
import taskService from "../../services/taskService";
import { ActivityIcon, PlusCircleIcon, EditIcon, CheckIcon, TrashIcon } from "../icons";

const ACTION_META = {
  created: { label: "created", color: "navy", icon: <PlusCircleIcon /> },
  updated: { label: "updated", color: "teal", icon: <EditIcon /> },
  completed: { label: "completed", color: "green", icon: <CheckIcon /> },
  deleted: { label: "deleted", color: "red", icon: <TrashIcon /> },
};

const ActivityTimeline = ({ refreshKey }) => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const data = await taskService.getActivity();
        setActivities(data);
      } catch (err) {
        // non-critical
      } finally {
        setLoading(false);
      }
    };
    fetchActivity();
  }, [refreshKey]);

  if (loading) return null;

  return (
    <div className="pmp-card">
      <h6 className="pmp-card-title"><ActivityIcon /> Recent Activity</h6>

      {activities.length === 0 ? (
        <p className="pmp-empty-inline">No activity yet.</p>
      ) : (
        <ul className="pmp-activity-list">
          {activities.map((a) => {
            const meta = ACTION_META[a.action] || { label: a.action, color: "navy", icon: <ActivityIcon /> };
            return (
              <li className="pmp-activity-item" key={a._id}>
                <span className={`pmp-activity-dot pmp-activity-${meta.color}`}>{meta.icon}</span>
                <span className="pmp-activity-text">
                  You <b>{meta.label}</b> "{a.taskTitle}"
                  <span className="pmp-activity-time">{new Date(a.createdAt).toLocaleString()}</span>
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default ActivityTimeline;