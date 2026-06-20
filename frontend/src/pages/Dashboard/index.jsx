import { useState, useEffect, useContext, useCallback } from "react";
import { AuthContext } from "../../context/AuthContext";
import taskService from "../../services/taskService";
import StatisticsCards from "../../components/StatisticsCards";
import TaskList from "../../components/TaskList";
import Loader from "../../components/Loader";
import SearchBar from "../../components/SearchBar";
import FilterDropdown from "../../components/FilterDropdown";
import SortDropdown from "../../components/SortDropdown";
import Pagination from "../../components/Pagination";
import ActivityTimeline from "../../components/ActivityTimeline";
import AIInsights from "../../components/AIInsights";
import EditTaskModal from "../../components/EditTaskModal";
import useDebounce from "../../hooks/useDebounce";

const Dashboard = () => {
  const { user } = useContext(AuthContext);

  const [stats, setStats] = useState({ total: 0, pending: 0, inProgress: 0, completed: 0 });
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [refreshKey, setRefreshKey] = useState(0);
  const [editingTask, setEditingTask] = useState(null);

  const debouncedSearch = useDebounce(search, 400);

  const loadTasks = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await taskService.getTasks({ search: debouncedSearch, status, sort, page, limit: 5 });
      setTasks(data.tasks);
      setTotalPages(data.totalPages);
    } catch (err) {
      setError("Failed to load tasks");
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, status, sort, page]);

  const loadStats = useCallback(async () => {
    try {
      const data = await taskService.getStats();
      setStats(data);
    } catch (err) {
      // non-critical
    }
  }, []);

  useEffect(() => { setPage(1); }, [debouncedSearch, status, sort]);
  useEffect(() => { loadTasks(); }, [loadTasks]);
  useEffect(() => { loadStats(); }, [loadStats]);

  const bumpRefresh = () => setRefreshKey((prev) => prev + 1);

  const handleComplete = async (id) => {
    try {
      await taskService.completeTask(id);
      loadTasks(); loadStats(); bumpRefresh();
    } catch (err) {
      setError("Failed to update task");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this task?")) return;
    try {
      await taskService.deleteTask(id);
      loadTasks(); loadStats(); bumpRefresh();
    } catch (err) {
      setError("Failed to delete task");
    }
  };

  const handleEditSaved = () => {
    setEditingTask(null);
    loadTasks(); loadStats(); bumpRefresh();
  };

  return (
    <div className="pmp-page">
      <h3 className="pmp-page-title">Welcome, {user?.name}</h3>

      {error && <div className="pmp-alert-error">{error}</div>}

      <StatisticsCards stats={stats} />

      <div className="pmp-dashboard-grid">
        <div>
          <div className="pmp-controls-row">
            <SearchBar value={search} onChange={setSearch} />
            <FilterDropdown value={status} onChange={setStatus} />
            <SortDropdown value={sort} onChange={setSort} />
          </div>

          {loading ? (
            <Loader />
          ) : (
            <>
              <TaskList tasks={tasks} onComplete={handleComplete} onDelete={handleDelete} onEdit={setEditingTask} />
              <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
            </>
          )}
        </div>

        <div>
          <AIInsights refreshKey={refreshKey} />
          <ActivityTimeline refreshKey={refreshKey} />
        </div>
      </div>

      <EditTaskModal task={editingTask} onClose={() => setEditingTask(null)} onSaved={handleEditSaved} />
    </div>
  );
};

export default Dashboard;