const { Octokit } = require("@octokit/rest");
const { ESLint } = require("eslint");
const pLimit = require("p-limit");

// Initialize Octokit 
const octokit = new Octokit({
  auth: process.env.GITHUB_ACCESS_TOKEN,
});

const eslint = new ESLint();

/**
 * Get repository details
 * @param {string} owner - Repository owner
 * @param {string} repo - Repository name
 * @returns {Promise} Repository details
 */
async function getRepository(owner, repo) {
  try {
    if (!owner || !repo) {
      throw new Error("Both owner and repository name are required");
    }

    const response = await octokit.rest.repos.get({
      owner,
      repo,
      headers: {
        "X-GitHub-Api-Version": "2022-11-28",
      },
    });

    return response.data;
  } catch (error) {
    if (error.status === 404) {
      throw new Error(`Repository not found: ${owner}/${repo}`);
    }
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

async function getFileContent(owner, repo, path) {
  try {
    const { data } = await octokit.repos.getContent({
      owner,
      repo,
      path,
    });

    // If data is an array, it's a directory listing
    if (Array.isArray(data)) {
      return data;
    }

    // If it's a file, decode the content
    if (data.content) {
      const content = Buffer.from(data.content, "base64").toString();
      let lintResults = [];

      // Check if file is JavaScript/JSX
      if (path.match(/\.(js|jsx)$/)) {
        console.log(`🔍 Linting ${path}...`);
        const results = await eslint.lintText(content, {
          filePath: path,
        });
        lintResults = results[0].messages;
        console.log("Lint results:", lintResults);
      }

      return {
        content,
        lintResults,
      };
    }

    throw new Error("Unsupported content type");
  } catch (error) {
    console.error("Error fetching content:", error);
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

// Utility: fetch the entire file tree once using the Git data API
async function listRepositoryFiles(owner, repo) {
  // Resolve default branch and latest commit SHA
  const { data: repoData } = await octokit.repos.get({ owner, repo });
  const { data: branchData } = await octokit.repos.getBranch({
    owner,
    repo,
    branch: repoData.default_branch,
  });

  // Get full tree recursively (single request) 🎄
  const {
    data: { tree },
  } = await octokit.git.getTree({
    owner,
    repo,
    tree_sha: branchData.commit.sha,
    recursive: 1,
  });

  return tree.filter((t) => t.type === "blob"); // only files
}

// Helper function to group ESLint messages by ruleId (or message string when none)
function groupMessagesByRule(messages, sampleCap = 5) {
  const map = new Map();

  for (const msg of messages) {
    const key = msg.ruleId || msg.message;
    if (!map.has(key)) {
      map.set(key, {
        ruleId: msg.ruleId ?? "(generic)",
        severity: msg.severity,
        count: 0,
        samples: [],
      });
    }

    const bucket = map.get(key);
    bucket.count += 1;
    if (bucket.samples.length < sampleCap) {
      bucket.samples.push({
        file: msg.file,
        line: msg.line,
        column: msg.column,
        message: msg.message,
      });
    }
  }

  return Array.from(map.values());
}

// Lint an entire repository in-memory (no git clone required)
async function lintRepository(owner, repo) {
  const allFiles = await listRepositoryFiles(owner, repo);

  // Filter only JavaScript/TypeScript source files
  const sourceFiles = allFiles.filter((f) => /\.(jsx?|tsx?)$/i.test(f.path));

  const limit = pLimit(10); // fetch up to 10 blobs concurrently
  const blobPromises = sourceFiles.map((file) =>
    limit(async () => {
      const {
        data: { content: base64Content },
      } = await octokit.git.getBlob({ owner, repo, file_sha: file.sha });

      const source = Buffer.from(base64Content, "base64").toString("utf8");
      return { path: file.path, source };
    })
  );

  const blobs = await Promise.all(blobPromises);

  // Lint each file's text using eslint.lintText
  const allMessages = [];
  for (const { path, source } of blobs) {
    const [result] = await eslint.lintText(source, { filePath: path });
    result.messages.forEach((m) => allMessages.push({ ...m, file: path }));
  }

  // Build grouped summary
  const grouped = groupMessagesByRule(allMessages);

  return { grouped, messages: allMessages };
}

// Fetch latest commit SHA of default branch for caching purposes
async function getLatestCommitSha(owner, repo) {
  const { data: repoData } = await octokit.repos.get({ owner, repo });
  const { data: branchData } = await octokit.repos.getBranch({
    owner,
    repo,
    branch: repoData.default_branch,
  });
  return branchData.commit.sha;
}

module.exports = {
  getRepository,
  getRepositoryContents,
  getFileContent,
  getLintingIssues,
  lintRepository,
  listRepositoryFiles,
  groupMessagesByRule,
  getLatestCommitSha,
};
