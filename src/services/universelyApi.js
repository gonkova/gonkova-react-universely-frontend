// src/services/universelyApi.js
import apiClient from "./apiClient"; // 👈 трябва да е default import

export function getStories(page = 1, pageSize = 10) {
  return apiClient
    .get("/stories", {
      params: { Page: page, PageSize: pageSize },
    })
    .then((res) => res.data);
}

export function getPassages(storyId, pageSize = 10) {
  return apiClient
    .get(`/stories/${storyId}/passages`, {
      params: { PageSize: pageSize },
    })
    .then((res) => res.data);
}
