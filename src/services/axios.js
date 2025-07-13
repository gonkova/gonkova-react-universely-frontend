import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5249",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: false,
});

let store = {
  accessToken: null,
  refreshToken: null,
  refreshAccessToken: null,
  logout: null,
};

export const setAuthStore = ({
  accessToken,
  refreshToken,
  refreshAccessToken,
  logout,
}) => {
  store = { accessToken, refreshToken, refreshAccessToken, logout };
};

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
        return api(originalRequest);
      } else {
        store.logout?.();
      }
    }

    return Promise.reject(error);
  }
);

export default api;
