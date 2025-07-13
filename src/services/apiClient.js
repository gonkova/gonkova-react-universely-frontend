import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // по желание timeout 10 секунди
});

// Пример интерцептор за грешки (по избор)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Можеш да обработиш грешки, напр. логване, съобщения и др.
      console.error("API error:", error.response.data);
    }
    return Promise.reject(error);
  }
);

export default apiClient;
