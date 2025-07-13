import api from "./axios"; // с токени

export function getPassages(storyId, page = 1, pageSize = 5) {
  return api
    .get(`/stories/${storyId}/passages`, {
      params: { Page: page, PageSize: pageSize },
    })
    .then((res) => res.data);
}
