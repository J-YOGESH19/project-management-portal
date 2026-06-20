import { LayersIcon, ClockIcon, RefreshIcon, CheckCircleIcon } from "../icons";

const StatisticsCards = ({ stats }) => {
  const cards = [
    { key: "total", label: "Total Tasks", value: stats.total, color: "navy", icon: <LayersIcon /> },
    { key: "pending", label: "Pending", value: stats.pending, color: "amber", icon: <ClockIcon /> },
    { key: "inProgress", label: "In Progress", value: stats.inProgress, color: "teal", icon: <RefreshIcon /> },
    { key: "completed", label: "Completed", value: stats.completed, color: "green", icon: <CheckCircleIcon /> },
  ];

  return (
    <div className="pmp-stats-grid">
      {cards.map((c) => (
        <div className={`pmp-stat-card pmp-stat-${c.color}`} key={c.key}>
          <div className="pmp-stat-icon">{c.icon}</div>
          <div>
            <p className="pmp-stat-label">{c.label}</p>
            <h3 className="pmp-stat-value">{c.value ?? 0}</h3>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatisticsCards;