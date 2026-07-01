import { useState, useEffect } from "react";
import taskService from "../../services/taskService";

// ---- relative time ----
const formatRelativeTime = (dateStr) => {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const timeStr = date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;

  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  if (date.toDateString() === yesterday.toDateString()) return `Yesterday at ${timeStr}`;

  const diffDays = Math.floor(diffMs / 86400000);
  if (diffDays < 7) return `${date.toLocaleDateString([], { weekday: "long" })} at ${timeStr}`;

  return `${date.toLocaleDateString([], { month: "short", day: "numeric" })} at ${timeStr}`;
};

// ---- date group header label ----
const getGroupLabel = (dateStr) => {
  const now = new Date();
  const date = new Date(dateStr);
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.toDateString() === now.toDateString()) return "Today";
  if (date.toDateString() === yesterday.toDateString()) return "Yesterday";

  const diffDays = Math.floor((now - date) / 86400000);
  if (diffDays < 7) return date.toLocaleDateString([], { weekday: "long" });

  return date.toLocaleDateString([], { month: "long", day: "numeric" });
};

const groupActivities = (activities) => {
  const groups = [];
  let current = null;
  activities.forEach((a) => {
    const label = getGroupLabel(a.createdAt);
    if (!current || current.label !== label) {
      current = { label, items: [] };
      groups.push(current);
    }
    current.items.push(a);
  });
  return groups;
};

// ---- icons ----
const ClockIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 3" />
  </svg>
);

const EmptyIcon = () => (
  <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--pmp-slate-500)", opacity: 0.45 }}>
    <path d="M3 12h4l3 8 4-16 3 8h4" />
  </svg>
);

const ActionIcon = ({ action }) => {
  if (action === "created") return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" /><path d="M12 8v8M8 12h8" />
    </svg>
  );
  if (action === "updated") return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 20h9" /><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
    </svg>
  );
  if (action === "completed") return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
  if (action === "deleted") return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 6h18" />
      <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
    </svg>
  );
  return null;
};

// ---- action meta ----
const ACTION_META = {
  created:   { label: "created",   colorClass: "pmp-activity-navy",  dotClass: "pmp-dot-created" },
  updated:   { label: "updated",   colorClass: "pmp-activity-teal",  dotClass: "pmp-dot-updated" },
  completed: { label: "completed", colorClass: "pmp-activity-green", dotClass: "pmp-dot-completed" },
  deleted:   { label: "deleted",   colorClass: "pmp-activity-red",   dotClass: "pmp-dot-deleted" },
};

const INITIAL_SHOW = 5;

const ActivityTimeline = ({ refreshKey }) => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const data = await taskService.getActivity();
        setActivities(data);
      } catch {
        // non-critical
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [refreshKey]);

  if (loading) return null;

  const visible = showAll ? activities : activities.slice(0, INITIAL_SHOW);
  const hiddenCount = activities.length - INITIAL_SHOW;
  const groups = groupActivities(visible);

  return (
    <div className="pmp-card">
      <h6 className="pmp-card-title">
        <ClockIcon /> Recent Activity
      </h6>

      {activities.length === 0 ? (
        <div className="pmp-activity-empty">
          <EmptyIcon />
          <p>Nothing logged yet</p>
          <span>Create or complete a task to see activity here.</span>
        </div>
      ) : (
        <>
          <ul className="pmp-activity-list">
            {groups.map((group) => (
              <>
                <li className="pmp-activity-group-label" key={`g-${group.label}`}>
                  {group.label}
                </li>
                {group.items.map((a) => {
                  const meta = ACTION_META[a.action] || ACTION_META.created;
                  return (
                    <li className="pmp-activity-item" key={a._id}>
                      <span className={`pmp-activity-dot ${meta.dotClass}`}>
                        <ActionIcon action={a.action} />
                      </span>
                      <span className="pmp-activity-text">
                        You{" "}
                        <span className={`pmp-activity-verb ${meta.colorClass}`}>
                          {meta.label}
                        </span>{" "}
                        <span className="pmp-activity-task-name">"{a.taskTitle}"</span>
                        <span className="pmp-activity-time">
                          {formatRelativeTime(a.createdAt)}
                        </span>
                      </span>
                    </li>
                  );
                })}
              </>
            ))}
          </ul>

          {!showAll && hiddenCount > 0 && (
            <button className="pmp-activity-show-more" onClick={() => setShowAll(true)}>
              Show {hiddenCount} more
            </button>
          )}
          {showAll && activities.length > INITIAL_SHOW && (
            <button className="pmp-activity-show-more" onClick={() => setShowAll(false)}>
              Show less
            </button>
          )}
        </>
      )}
    </div>
  );
};

export default ActivityTimeline;