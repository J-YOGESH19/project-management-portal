import api from "./api";

const persist = (data, remember) => {
  const storage = remember ? localStorage : sessionStorage;
  const other = remember ? sessionStorage : localStorage;
  storage.setItem("token", data.token);
  storage.setItem("user", JSON.stringify(data));
  other.removeItem("token");
  other.removeItem("user");
};

const register = async (name, email, password) => {
  const { data } = await api.post("/auth/register", { name, email, password });
  if (data.token) persist(data, true);
  return data;
};

const login = async (email, password, remember = true) => {
  const { data } = await api.post("/auth/login", { email, password });
  if (data.token) persist(data, remember);
  return data;
};

const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  sessionStorage.removeItem("token");
  sessionStorage.removeItem("user");
};

const getCurrentUser = () => {
  const user = localStorage.getItem("user") || sessionStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

const forgotPassword = async (email) => {
  const { data } = await api.post("/auth/forgot-password", { email });
  return data;
};

const resetPassword = async (token, password) => {
  const { data } = await api.put(`/auth/reset-password/${token}`, { password });
  return data;
};
const updatePassword = async (currentPassword, newPassword) => {
  const { data } = await api.put("/auth/update-password", { currentPassword, newPassword });
  return data;
};

const updateAvatar = async (avatar) => {
  const { data } = await api.put("/auth/avatar", { avatar });
  return data;
};

export default { register, login, logout, getCurrentUser, forgotPassword, resetPassword, updatePassword, updateAvatar };
