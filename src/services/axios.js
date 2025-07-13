import axios from "axios";

// Създаваме инстанция на axios
const api = axios.create({
  baseURL: "http://localhost:5249",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: false, // Сложи true само ако бекендът използва cookies (в твоя случай – false е правилно)
});

// Създаваме store за достъп до auth state от AuthContext
let store = {
  accessToken: null,
  refreshToken: null,
  refreshAccessToken: null,
  logout: null,
};

// Позволява ни да регистрираме стойностите от AuthContext
export const setAuthStore = ({
  accessToken,
  refreshToken,
  refreshAccessToken,
  logout,
}) => {
  store = { accessToken, refreshToken, refreshAccessToken, logout };
};

// Интерцептор за response – хваща 401 и опитва автоматично обновяване
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      store.refreshToken &&
      store.refreshAccessToken
    ) {
      originalRequest._retry = true;

      const success = await store.refreshAccessToken();

      if (success && store.accessToken) {
        originalRequest.headers[
          "Authorization"
        ] = `Bearer ${store.accessToken}`;
        return api(originalRequest); // retry заявката
      } else {
        store.logout?.();
      }
    }

    return Promise.reject(error);
  }
);

export default api;
