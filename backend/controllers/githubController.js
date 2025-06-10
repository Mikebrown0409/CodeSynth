const githubService = require("../services/githubService");

// basically index
async function analyzeRepository(req, res) {
  try {
    const { owner, repo } = req.body;

    // Get basic repository info
    const repoData = await githubService.getRepository(owner, repo);

    // Get repository contents
    const contents = await githubService.getRepositoryContents(owner, repo);

    // Get linting issues
    const lintingIssues = await githubService.getLintingIssues(owner, repo);

    res.json({
      repository: repoData,
      contents,
      lintingIssues,
    });
  } catch (error) {
    console.error("Error analyzing repository:", error);
    res.status(500).json({ error: "Failed to analyze repository" });
  }
}
async function getFileContent(req, res) {
  try {
    const { owner, repo, path } = req.body;
    const content = await githubService.getFileContent(owner, repo, path);
    res.json({ content });
  } catch (err) {
    console.error(" Error fetching file details:", err);
    res.status(500).json({ error: "Failed to fetch the file content" });
  }
}

module.exports = {
  analyzeRepository,
  getFileContent,
};
