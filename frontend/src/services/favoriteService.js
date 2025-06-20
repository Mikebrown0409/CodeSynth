import sendRequest from "./sendRequest";

const BASE_URL = "/api/favorites/";

export async function getFavorites() {
  return sendRequest(BASE_URL);
}

export async function toggleFavorite(repoId) {
  return sendRequest(`${BASE_URL}${repoId}`, "POST");
} 