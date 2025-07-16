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

export function login(email, password) {
  return api.post("/users/login", { email, password }).then((res) => res.data);
}

export function register(email, userName, password) {
  return api
    .post("/users/register", { email, userName, password })
    .then((res) => res.data);
}

export function refreshTokenRequest(refreshToken) {
  return api
    .post(
      "/users/refresh",
      { refreshToken },
      {
        headers: { Authorization: `Bearer ${refreshToken}` },
      }
    )
    .then((res) => res.data);
}

export function getStories(page = 1, pageSize = 10) {
  return api
    .get("/stories", { params: { Page: page, PageSize: pageSize } })
    .then((res) => res.data);
}

export function getPassages(storyId, page = 1, pageSize = 5) {
  return api
    .get(`/stories/${storyId}/passages`, {
      params: { Page: page, PageSize: pageSize },
    })
    .then((res) => res.data);
}

export default api;
