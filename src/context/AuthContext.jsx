import React, { createContext, useState, useEffect } from "react";
import {
  login as loginApi,
  refreshTokenRequest,
  setAuthStore,
} from "@/services/api";
import { parseJwt } from "@/utils/jwt";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [accessToken, setAccessToken] = useState(
    () => localStorage.getItem("accessToken") || null
  );
  const [refreshToken, setRefreshToken] = useState(
    () => localStorage.getItem("refreshToken") || null
  );
  const [loading, setLoading] = useState(false);

  const user = accessToken ? parseJwt(accessToken) : null;
  const isAuthenticated = !!accessToken;

  useEffect(() => {
    accessToken
      ? localStorage.setItem("accessToken", accessToken)
      : localStorage.removeItem("accessToken");

    refreshToken
      ? localStorage.setItem("refreshToken", refreshToken)
      : localStorage.removeItem("refreshToken");
  }, [accessToken, refreshToken]);

  async function login(email, password) {
    setLoading(true);
    try {
      const data = await loginApi(email, password);
      setAccessToken(data.accessToken);
      setRefreshToken(data.refreshToken);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.detail || "Грешка при логване",
      };
    } finally {
      setLoading(false);
    }
  }

  async function refreshAccessToken() {
    try {
      if (!refreshToken) throw new Error("Липсва refreshToken");
      const data = await refreshTokenRequest(refreshToken);
      setAccessToken(data.accessToken);
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
    setAuthStore({
      accessToken,
      refreshToken,
      refreshAccessToken,
      logout,
    });
  }, [accessToken, refreshToken]);

  return (
    <AuthContext.Provider
      value={{
        accessToken,
        refreshToken,
        login,
        logout,
        refreshAccessToken,
        user,
        loading,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
