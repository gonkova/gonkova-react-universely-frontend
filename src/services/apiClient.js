import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://localhost:5249", // ❗ Без /api
  headers: {
    "Content-Type": "application/json",
  },
});

export default apiClient;
