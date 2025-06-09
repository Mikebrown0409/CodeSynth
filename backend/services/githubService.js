const { Octokit } = require("@octokit/rest");

// Initialize Octokit with auth token from environment variables
const octokit = new Octokit({
  auth: process.env.GITHUB_ACCESS_TOKEN,
});

/**
 * Get repository details
 * @param {string} owner - Repository owner
 * @param {string} repo - Repository name
 * @returns {Promise} Repository details
 */
async function getRepository(owner, repo) {
  try {
    const { data } = await octokit.repos.get({
      owner,
      repo,
    });
    return data;
  } catch (error) {
    console.error("Error fetching repository:", error);
    throw error;
  }
}

/**
 * Get repository contents
 * @param {string} owner - Repository owner
 * @param {string} repo - Repository name
 * @param {string} path - Path to file or directory (optional)
 * @returns {Promise} Repository contents
 */
async function getRepositoryContents(owner, repo, path = "") {
  try {
    const { data } = await octokit.repos.getContent({
      owner,
      repo,
      path,
    });
    return data;
  } catch (error) {
    console.error("Error fetching repository contents:", error);
    throw error;
  }
}

/**
 * Get repository issues with linting/eslint labels
 * @param {string} owner - Repository owner
 * @param {string} repo - Repository name
 * @returns {Promise} Repository issues
 */
async function getLintingIssues(owner, repo) {
  try {
    const { data } = await octokit.issues.listForRepo({
      owner,
      repo,
      labels: ["eslint", "linting"],
      state: "open",
    });
    return data;
  } catch (error) {
    console.error("Error fetching linting issues:", error);
    throw error;
  }
}

module.exports = {
  getRepository,
  getRepositoryContents,
  getLintingIssues,
};
