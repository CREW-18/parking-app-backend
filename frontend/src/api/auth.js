import { api } from "./api";

const persistSession = (data) => {
  if (!data?.token) {
    return;
  }

  const user = {
    _id: data._id,
    userId: data._id,
    name: data.name,
    email: data.email,
    profilePic: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(data.email)}`,
  };

  localStorage.setItem("token", data.token);
  localStorage.setItem("user", JSON.stringify(user));
  localStorage.setItem("slotify_user", JSON.stringify(user));
  window.dispatchEvent(new Event("slotify-auth-changed"));
};

export const loginUser = async (email, password) => {
  const response = await api.post("/api/auth/login", { email, password });
  persistSession(response.data);
  return response.data;
};

export const registerUser = async ({ name, email, password }) => {
  const response = await api.post("/api/auth/register", { name, email, password });
  persistSession(response.data);
  return response.data;
};

export const logoutUser = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  localStorage.removeItem("slotify_user");
  window.dispatchEvent(new Event("slotify-auth-changed"));
  window.location.href = "/login";
};
