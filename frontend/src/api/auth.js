import { api } from "./api";

const allowDemoLogin = import.meta.env.VITE_ALLOW_DEMO_LOGIN !== "false";

const getDisplayNameFromEmail = (email) => {
  const [name] = email.split("@");
  return name
    .split(/[._-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ") || "Guest Pilot";
};

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

const persistDemoSession = (email) => {
  const normalizedEmail = email.trim().toLowerCase();
  const demoId = `demo-${normalizedEmail.replace(/[^a-z0-9]/g, "-")}`;

  const data = {
    _id: demoId,
    name: getDisplayNameFromEmail(normalizedEmail),
    email: normalizedEmail,
    token: `demo-token-${Date.now()}`,
  };

  persistSession(data);
  return data;
};

export const loginUser = async (email, password) => {
  try {
    const response = await api.post("/api/auth/login", { email, password });
    persistSession(response.data);
    return response.data;
  } catch (error) {
    if (allowDemoLogin && error.response?.status === 401) {
      return persistDemoSession(email);
    }

    throw error;
  }
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
