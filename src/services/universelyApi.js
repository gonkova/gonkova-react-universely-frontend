import apiClient from "./apiClient";

// Пример: взимане на всички истории
export function getStories() {
  return apiClient.get("/stories").then((res) => res.data);
}

// Пример: взимане на пасажи от история по ID
export function getPassages(storyId, pageSize = 10) {
  return apiClient
    .get(`/stories/${storyId}/passages`, {
      params: { PageSize: pageSize },
    })
    .then((res) => res.data);
}
