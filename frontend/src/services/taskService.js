import api from "./api";

const getTasks = async ({ search = "", status = "All", sort = "newest", page = 1, limit = 5 } = {}) => {
  const { data } = await api.get("/tasks", {
    params: { search, status, sort, page, limit },
  });
  return data; // { tasks, total, page, totalPages }
};

const createTask = async (taskData) => {
  const { data } = await api.post("/tasks", taskData);
  return data;
};

const updateTask = async (id, taskData) => {
  const { data } = await api.put(`/tasks/${id}`, taskData);
  return data;
};

const completeTask = async (id) => {
  const { data } = await api.put(`/tasks/${id}`, { status: "Completed" });
  return data;
};

const deleteTask = async (id) => {
  const { data } = await api.delete(`/tasks/${id}`);
  return data;
};

const getStats = async () => {
  const { data } = await api.get("/tasks/stats");
  return data; // { total, pending, inProgress, completed }
};

const getActivity = async () => {
  const { data } = await api.get("/activity");
  return data;
};

export default { getTasks, createTask, updateTask, completeTask, deleteTask, getStats, getActivity };