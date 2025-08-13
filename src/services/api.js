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
  setTokens: null,
};

export const setAuthStore = ({
  accessToken,
  refreshToken,
  refreshAccessToken,
  logout,
  setTokens,
}) => {
  store = { accessToken, refreshToken, refreshAccessToken, logout, setTokens };
};

api.interceptors.request.use(
  (config) => {
    const token = store.accessToken;
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

let isRefreshing = false;
let refreshSubscribers = [];

function onRefreshed(newToken) {
  refreshSubscribers.forEach((cb) => cb(newToken));
  refreshSubscribers = [];
}

function addRefreshSubscriber(cb) {
  refreshSubscribers.push(cb);
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    const status = error.response?.status;
    if (status !== 401) {
      return Promise.reject(error);
    }

    if (originalRequest._retry) {
      return Promise.reject(error);
    }

    if (!store.refreshToken || !store.refreshAccessToken) {
      store.logout?.();
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        addRefreshSubscriber((newToken) => {
          if (!newToken) {
            reject(error);
            return;
          }
          originalRequest._retry = true;
          originalRequest.headers = originalRequest.headers || {};
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          resolve(api(originalRequest));
        });
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const refreshed = await store.refreshAccessToken();

      const newAccessToken = store.accessToken;

      if (refreshed && newAccessToken) {
        onRefreshed(newAccessToken);
        originalRequest.headers = originalRequest.headers || {};
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } else {
        onRefreshed(null);
        store.logout?.();
        return Promise.reject(error);
      }
    } catch (err) {
      onRefreshed(null);
      store.logout?.();
      return Promise.reject(err);
    } finally {
      isRefreshing = false;
    }
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
  return api.post("/users/refresh", { refreshToken }).then((res) => res.data);
}

export function forgotPassword(email) {
  return api.post("/users/forgot-password", { email });
}

export function resetPassword(email, encodedToken, newPassword) {
  return api.post("/users/reset-password", {
    email,
    encodedToken,
    newPassword,
  });
}

export function getCurrentUser() {
  return api.get("/users/me").then((res) => res.data);
}

export function storyReactions(storyId, reactionType) {
  return api.post(`/stories/${storyId}/reactions`, { reactionType });
}

export function getStoryById(id) {
  return api.get(`/stories/reactions/${id}`).then((res) => res.data);
}

export function getStoryDetailsById(id, selectedGenreNames = []) {
  const genresArray = Array.isArray(selectedGenreNames)
    ? selectedGenreNames
    : selectedGenreNames
    ? [selectedGenreNames]
    : [];

  const params = new URLSearchParams();
  if (genresArray.length > 0) {
    params.append("categories", genresArray.join(","));
  }

  const url = params.toString()
    ? `/stories/${id}?${params.toString()}`
    : `/stories/${id}`;

  return api.get(url).then((res) => res.data);
}

export function getPassages(storyId, page = 1, pageSize = 5) {
  return api
    .get(`/stories/${storyId}/passages`, {
      params: { Page: page, PageSize: pageSize },
    })
    .then((res) => res.data);
}

export function getGenres() {
  return api.get("/genres").then((res) => res.data);
}

export const getStories = async (page, pageSize, categories = []) => {
  const params = new URLSearchParams({ Page: page, PageSize: pageSize });
  categories.forEach((cat) => params.append("Genres", cat));
  const { data } = await api.get(`/stories?${params.toString()}`);
  return data;
};

export default api;
