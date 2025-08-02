import React, { createContext, useState, useEffect } from "react";
import { refreshAccessTokenHandler } from "@/services/authService";
import {
  login as loginApi,
  setAuthStore,
  getCurrentUser,
} from "@/services/api";
import { parseJwt } from "@/utils/jwt";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  // Състояние за токени
  const [accessToken, setAccessToken] = useState(
    () => localStorage.getItem("accessToken") || null
  );
  const [refreshToken, setRefreshToken] = useState(
    () => localStorage.getItem("refreshToken") || null
  );

  // Състояние за потребител (пълен обект от backend)
  const [user, setUser] = useState(null);

  // Зареждащо състояние за логин/операции
  const [loading, setLoading] = useState(false);

  // Флаг за проверка дали е логнат
  const isAuthenticated = !!accessToken;

  // Записваме токените в localStorage при промяна
  useEffect(() => {
    if (accessToken) {
      localStorage.setItem("accessToken", accessToken);
    } else {
      localStorage.removeItem("accessToken");
    }

    if (refreshToken) {
      localStorage.setItem("refreshToken", refreshToken);
    } else {
      localStorage.removeItem("refreshToken");
    }
  }, [accessToken, refreshToken]);

  // При промяна на accessToken се извлича пълният потребител от backend
  useEffect(() => {
    if (!accessToken) {
      setUser(null); // Ако няма токен, няма user
      return;
    }

    getCurrentUser(accessToken)
      .then((data) => setUser(data)) // Записваме пълния потребител
      .catch((err) => {
        console.error("Грешка при извличане на потребителя:", err);
        setUser(null);
      });
  }, [accessToken]);

  // Функция за логин (получава токени)
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

  // Функция за освежаване на accessToken
  async function refreshAccessToken() {
    const result = await refreshAccessTokenHandler(refreshToken);

    if (result.success) {
      setAccessToken(result.accessToken);
      return true;
    } else {
      logout();
      return false;
    }
  }

  // Функция за изход (logout)
  function logout() {
    setAccessToken(null);
    setRefreshToken(null);
    setUser(null);
  }

  // Обновяваме "глобалния" store за api.js (за интерцептори)
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
