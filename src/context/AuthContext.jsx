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

  // refreshAccessToken: връща новия accessToken или null
  const refreshAccessToken = useCallback(async () => {
    if (!refreshToken) return null;
    const result = await refreshAccessTokenHandler(refreshToken);
    if (result.success && result.accessToken) {
      setAccessToken(result.accessToken);
      if (result.refreshToken) {
        setRefreshToken(result.refreshToken);
      }
      return result.accessToken;
    } else {
      logout();
      return null;
    }
  }, [refreshToken]);

  // logout
  function logout() {
    setAccessToken(null);
    setRefreshToken(null);
    setUser(null);
  }

  // ✨ НОВА ФУНКЦИЯ: updateUser за ръчно обновяване на user данни
  function updateUser(updatedUserData) {
    setUser(updatedUserData);
  }

  // expose helper за api.js
  useEffect(() => {
    setAuthStore({
      accessToken,
      refreshToken,
      refreshAccessToken,
      logout,
      setTokens: ({ accessToken: a, refreshToken: r }) => {
        if (a) setAccessToken(a);
        if (r) setRefreshToken(r);
      },
    });
  }, [accessToken, refreshToken, refreshAccessToken]);

  // Silent refresh при mount
  useEffect(() => {
    async function trySilentRefresh() {
      if (!accessToken && refreshToken) {
        await refreshAccessToken();
      }
    }
    trySilentRefresh();
  }, []); // само при mount

  // 🔑 Проактивен refresh преди exp
  useEffect(() => {
    if (!accessToken) return;

    try {
      const { exp } = parseJwt(accessToken); // exp е в секунди
      const now = Math.floor(Date.now() / 1000);
      const refreshIn = exp - 30 - now; // 30 секунди преди expiry

      if (refreshIn <= 0) {
        // вече е изтекъл/на ръба → рефрешни веднага
        refreshAccessToken();
        return;
      }

      const id = setTimeout(() => {
        refreshAccessToken().catch(() => logout());
      }, refreshIn * 1000);

      return () => clearTimeout(id);
    } catch (err) {
      console.warn("Неуспешно декодиране на accessToken:", err);
    }
  }, [accessToken, refreshAccessToken]);

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
        updateUser, // ✨ Експортираме новата функция
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
