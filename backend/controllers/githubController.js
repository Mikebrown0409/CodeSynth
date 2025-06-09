const githubService = require("../services/githubService");

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

module.exports = {
  analyzeRepository,
};
