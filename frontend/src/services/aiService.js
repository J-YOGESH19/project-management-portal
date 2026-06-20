import api from "./api";

const generateDescription = async (title) => {
  const { data } = await api.post("/ai/generate-description", { title });
  return data.description;
};

const breakdownTask = async (title) => {
  const { data } = await api.post("/ai/breakdown", { title });
  return data.subtasks;
};

const recommendPriority = async (title, description) => {
  const { data } = await api.post("/ai/priority", { title, description });
  return data.priority;
};

const getInsights = async () => {
  const { data } = await api.get("/ai/insights");
  return data; // { pending, inProgress, completed, message, suggestion }
};

export default { generateDescription, breakdownTask, recommendPriority, getInsights };