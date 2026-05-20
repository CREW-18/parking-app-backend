import { createContext, useContext, useEffect, useState } from "react";

const UserContext = createContext();

const fallbackUser = {
  userId: "guest",
  name: "Guest Pilot",
  email: "guest@slotify.local",
  profilePic: "https://api.dicebear.com/7.x/avataaars/svg?seed=Slotify",
};

const readStoredUser = () => {
  const savedUser = localStorage.getItem("slotify_user") || localStorage.getItem("user");

  if (!savedUser) {
    return fallbackUser;
  }

  try {
    return { ...fallbackUser, ...JSON.parse(savedUser) };
  } catch {
    return fallbackUser;
  }
};

export const UserProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(fallbackUser);

  const refreshUser = () => {
    setUserData(readStoredUser());
    setLoading(false);
  };

  const updateUserData = async (newData) => {
    const updatedUser = { ...userData, ...newData };
    setUserData(updatedUser);
    localStorage.setItem("slotify_user", JSON.stringify(updatedUser));
    localStorage.setItem("user", JSON.stringify(updatedUser));
  };

  useEffect(() => {
    refreshUser();
    window.addEventListener("slotify-auth-changed", refreshUser);

    return () => window.removeEventListener("slotify-auth-changed", refreshUser);
  }, []);

  return (
    <UserContext.Provider value={{ userData, updateUserData, loading, refreshUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error("useUser must be used within UserProvider");
  }

  return context;
};
