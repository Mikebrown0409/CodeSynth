const { Octokit } = require("@octokit/rest");
const { ESLint } = require("eslint");

// Initialize Octokit with auth token from environment variables
const octokit = new Octokit({
  auth: process.env.GITHUB_ACCESS_TOKEN,
});

const eslint = new ESLint({
  overrideConfigFile: true,

  overrideConfig: {
    languageOptions: {
      ecmaVersion: 2023,
      sourceType: "module",
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
      globals: {
        require: "readonly",
        module: "readonly",
        process: "readonly",
        __dirname: "readonly",
        __filename: "readonly",
        Buffer: "readonly",
        window: "readonly",
        document: "readonly",
        jest: "readonly",
        describe: "readonly",
        it: "readonly",
        expect: "readonly",
      },
    },

    rules: {
      "no-undef": "error",
      "no-unused-vars": [
        "warn",
        { args: "after-used", ignoreRestSiblings: true },
      ],
      "no-console": "warn",
      "no-debugger": "warn",
      eqeqeq: ["error", "smart"],
      curly: ["error", "multi-line", "consistent"],

      /* Best Practices / Modern JS */
      "consistent-return": "error",
      "arrow-body-style": ["warn", "as-needed"],
      "prefer-const": "warn",
      "no-var": "error",

      /* Stylistic */
      semi: ["error", "always"],
      quotes: ["error", "single", { avoidEscape: true }],
      indent: ["error", 2, { SwitchCase: 1 }],
      "max-len": ["warn", { code: 100, ignoreUrls: true, ignoreStrings: true }],
    },
  },
});

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

module.exports = {
  getRepository,
  getRepositoryContents,
  getFileContent,
  getLintingIssues,
};
