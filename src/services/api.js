import apiClient from "./apiClient";

export function getStories() {
  return apiClient.get("/stories").then((res) => res.data);
}
