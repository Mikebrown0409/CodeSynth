import sendRequest from "./sendRequest";

const BASE_URL = "/api/repos/";

export async function index() {
  return sendRequest(BASE_URL);
}



export async function deleteRepo(repoId) {
  return sendRequest(`${BASE_URL}${repoId}`, "DELETE");
}

export async function analyzeRepo({ owner, repoName }) {
  return sendRequest(`${BASE_URL}analyze`, "POST", { owner, repo: repoName });
}
export async function getFileContent({ owner, repo, path }) {
  return sendRequest(`${BASE_URL}file-content`, "POST", { owner, repo, path });
}

export async function fixFile({ owner, repo, path }) {
  return sendRequest(`${BASE_URL}fix`, "POST", { owner, repo, path });
}
