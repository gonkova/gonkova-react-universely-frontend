import React, { createContext, useState, useEffect, useCallback } from "react";
import { refreshAccessTokenHandler } from "@/services/authService";
import {
  login as loginApi,
  setAuthStore,
  getCurrentUser,
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
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const isAuthenticated = !!accessToken;

  // sync localStorage
  useEffect(() => {
    if (accessToken) localStorage.setItem("accessToken", accessToken);
    else localStorage.removeItem("accessToken");

    if (refreshToken) localStorage.setItem("refreshToken", refreshToken);
    else localStorage.removeItem("refreshToken");
  }, [accessToken, refreshToken]);

  // fetch current user when accessToken changes
  useEffect(() => {
    if (!accessToken) {
      setUser(null);
      return;
    }
    getCurrentUser()
      .then((data) => setUser(data))
      .catch((err) => {
        console.error("Грешка при извличане на потребителя:", err);
        setUser(null);
      });
  }, [accessToken]);

  // login
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

  // refreshAccessToken: използва authService и обновява и refreshToken (ако е върнат)
  const refreshAccessToken = useCallback(async () => {
    if (!refreshToken) {
      return false;
    }

    const result = await refreshAccessTokenHandler(refreshToken);
    if (result.success && result.accessToken) {
      setAccessToken(result.accessToken);
      if (result.refreshToken) {
        setRefreshToken(result.refreshToken);
      }
      return true;
    } else {
      logout();
      return false;
    }
  }, [refreshToken]);

  // logout
  function logout() {
    setAccessToken(null);
    setRefreshToken(null);
    setUser(null);
  }

  // expose helper that api.js може да ползва (setAuthStore)
  useEffect(() => {
    setAuthStore({
      accessToken,
      refreshToken,
      refreshAccessToken,
      logout,
      // ако искаш, може да предоставиш setTokens helper за директна сетване
      setTokens: ({ accessToken: a, refreshToken: r }) => {
        if (a) setAccessToken(a);
        if (r) setRefreshToken(r);
      },
    });
  }, [accessToken, refreshToken, refreshAccessToken]);

  // Silent refresh при mount: ако нямаш accessToken, но имаш refreshToken -> опитай да вземеш нов accessToken
  useEffect(() => {
    let mounted = true;
    async function trySilentRefresh() {
      if (!accessToken && refreshToken) {
        // Вариант: проверка за exp в refreshToken може да се добави
        await refreshAccessToken();
      }
    }
    if (mounted) trySilentRefresh();
    return () => {
      mounted = false;
    };
  }, []); // run once on mount

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
