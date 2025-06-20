const githubService = require("../services/githubService");
const Repo = require("../models/repo");

// INDEX
async function index(req, res) {
  try {
    const repo = await Repo.find({ user: req.user._id });
    res.json(repo);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch repositories" });
  }
}

// ANALYZE (Create/Show)
async function analyzeRepository(req, res) {
  try {
    const { owner, repo } = req.body;

    if (!owner || !repo) {
      return res.status(400).json({
        error: "Missing required parameters: owner and repo name required",
      });
    }

    // Get basic repository info
    const repoData = await githubService.getRepository(owner, repo);

    // Determine latest commit SHA for caching validation
    const latestCommitSha = await githubService.getLatestCommitSha(owner, repo);

    // Check if we have up-to-date analysis cached
    let cachedRepo = await Repo.findOne({
      repo_id: repoData.id.toString(),
      latestCommitSha,
    });

    if (cachedRepo && cachedRepo.lintSummary && cachedRepo.lintMessages) {
      return res.json({
        repository: repoData,
        contents: await githubService.getRepositoryContents(owner, repo), // still refresh tree
        lintingIssues: await githubService.getLintingIssues(owner, repo),
        lintSummary: cachedRepo.lintSummary,
        lintMessages: cachedRepo.lintMessages,
        cached: true,
        savedRepo: cachedRepo,
      });
    }

    // Get repository contents
    const contents = await githubService.getRepositoryContents(owner, repo);

    // Get linting issues
    const lintingIssues = await githubService.getLintingIssues(owner, repo);

    // Perform repository-wide linting in memory (grouped + detailed)
    const { grouped: lintSummary, messages: lintMessages } =
      await githubService.lintRepository(owner, repo);

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
        latestCommitSha,
        lintSummary,
        lintMessages,
      },
      { new: true, upsert: true }
    );

    res.json({
      repository: repoData,
      contents,
      lintingIssues,
      lintSummary,
      lintMessages,
      savedRepo,
    });
  } catch (error) {
    // Repository analysis error
    res.status(error.status || 500).json({
      error: error.message || "Failed to analyze repository",
    });
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
    // Error fetching content
    res.status(500).json({ error: "Failed to fetch content" });
  }
}

// DELETE
async function deleteRepo(req, res) {
  try {
    const repoId = req.params.id;

    const repo = await Repo.findOneAndDelete({
      _id: repoId,
      user: req.user._id,
    });

    if (!repo) {
      return res.status(404).json({ error: "Repository not found" });
    }

    res.json({ message: "Repository deleted successfully", repo });
  } catch (err) {
    // Delete error
    res.status(500).json({ error: "Failed to delete repository" });
  }
}

async function fixFile(req, res) {
  try {
    const { owner, repo, path } = req.body;
    if (!owner || !repo || !path) {
      return res.status(400).json({ error: "owner, repo and path are required" });
    }

    const result = await githubService.getFileWithFix(owner, repo, path);
    res.json(result);
  } catch (err) {
    // Fix file error
    res.status(500).json({ error: "Failed to fix file" });
  }
}

// Future feature: Commit fixes to user's repository
async function commitFixes(req, res) {
  try {
    const { owner, repo, path, fixedContent, branch = 'main' } = req.body;
    const user = req.user;
    
    if (!user.githubAccessToken) {
      return res.status(401).json({ error: 'GitHub authentication required' });
    }
    
    const result = await githubService.commitFixes(
      owner,
      repo,
      path,
      fixedContent,
      user.githubAccessToken,
      branch
    );
    
    res.json(result);
  } catch (err) {
    // Error committing fixes
    res.status(500).json({ error: err.message });
  }
}

module.exports = {
  index,
  analyzeRepository,
  getFileContent,
  deleteRepo,
  fixFile,
  commitFixes,
};
