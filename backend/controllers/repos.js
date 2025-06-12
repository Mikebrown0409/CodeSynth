const githubService = require("../services/githubService");
const Repo = require("../models/repo");

// INDEX
async function index(req, res) {
  try {
    const repo = await Repo.find({ user: req.user._id });
    // .populate("owner");
    // .populate("comments.author");
    res.json(repo);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to fetch repositories" });
  }
}

async function analyzeRepository(req, res) {
  try {
    const { owner, repo } = req.body;

    // Get basic repository info
    const repoData = await githubService.getRepository(owner, repo);

    // Get repository contents
    const contents = await githubService.getRepositoryContents(owner, repo);

    // Get linting issues
    const lintingIssues = await githubService.getLintingIssues(owner, repo);

    // Save to database
    const savedRepo = await Repo.findOneAndUpdate(
      { repo_id: repoData.id.toString() },
      {
        repo_id: repoData.id.toString(),
        repo_url: repoData.html_url,
        repo_name: repoData.name,
        githubId: repoData.id.toString(),
        user: req.user._id,
        isPublic: !repoData.private,
        lastAnalyzed: new Date(),
      },
      { new: true, upsert: true }
    );

    res.json({
      repository: repoData,
      contents,
      lintingIssues,
      savedRepo,
    });
  } catch (error) {
    console.error("Error analyzing repository:", error);
    res.status(500).json({ error: "Failed to analyze repository" });
  }
}
async function getFileContent(req, res) {
  try {
    const { owner, repo, path } = req.body;
    const result = await githubService.getFileContent(owner, repo, path);

    // bugged out without the change, need for breadcrumbs/file path
    // If result is an array, it's directory contents
    if (Array.isArray(result)) {
      res.json(result);
      return;
    }

    // If it's a file, destructured to send content and lint results
    const { content, lintResults } = result;
    res.json({ content, lintResults });
  } catch (err) {
    console.error("Error fetching content:", err);
    res.status(500).json({ error: "Failed to fetch content" });
  }
}

module.exports = {
  index,
  analyzeRepository,
  getFileContent,
};
