import React, { createContext, useState, useEffect } from "react";
import api, { setAuthStore } from "../services/axios";
import { parseJwt } from "../utils/jwt";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [accessToken, setAccessToken] = useState(
    () => localStorage.getItem("accessToken") || null
  );
  const [refreshToken, setRefreshToken] = useState(
    () => localStorage.getItem("refreshToken") || null
  );

  const user = accessToken ? parseJwt(accessToken) : null;

  // Setting Authorization header for axios
  useEffect(() => {
    if (accessToken) {
      api.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
      localStorage.setItem("accessToken", accessToken);
    } else {
      delete api.defaults.headers.common["Authorization"];
      localStorage.removeItem("accessToken");
    }
  }, [accessToken]);

  useEffect(() => {
    if (refreshToken) {
      localStorage.setItem("refreshToken", refreshToken);
    } else {
      localStorage.removeItem("refreshToken");
    }
  }, [refreshToken]);

  async function login(email, password) {
    try {
      const res = await api.post("/users/login", { email, password });
      setAccessToken(res.data.accessToken);
      setRefreshToken(res.data.refreshToken);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.detail || "Грешка при логване",
      };
    }
  }

  async function refreshAccessToken() {
    try {
      if (!refreshToken) throw new Error("Липсва refreshToken");

      const res = await api.post(
        "/users/refresh",
        { refreshToken },
        {
          headers: { Authorization: `Bearer ${refreshToken}` },
        }
      );

      setAccessToken(res.data.accessToken);
      return true;
    } catch (error) {
      console.error("Refresh token error", error);
      logout();
      return false;
    }
  }

  function logout() {
    setAccessToken(null);
    setRefreshToken(null);
  }

  useEffect(() => {
    setAuthStore({ accessToken, refreshToken, refreshAccessToken, logout });
  }, [accessToken, refreshToken]);

  useEffect(() => {
    const tryRefresh = async () => {
      if (!accessToken && refreshToken) {
        await refreshAccessToken();
      }
    };
    tryRefresh();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        accessToken,
        refreshToken,
        login,
        logout,
        refreshAccessToken,
        user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
