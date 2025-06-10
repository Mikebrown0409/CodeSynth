import sendRequest from "./sendRequest";

const BASE_URL = "/api/github/";

export async function index() {
  return sendRequest(BASE_URL);
}

export async function create(postData) {
  return sendRequest(BASE_URL, "POST", postData);
}

export async function analyzeRepo({ owner, repo }) {
  return sendRequest(`${BASE_URL}analyze`, "POST", { owner, repo });
}
export async function getFileContent({ owner, repo, path }) {
  return sendRequest(`${BASE_URL}content`, "POST", { owner, repo, path });
}
