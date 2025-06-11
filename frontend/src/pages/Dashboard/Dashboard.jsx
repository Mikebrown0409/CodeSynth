import { useState, useEffect } from "react";
import RepoAnalyzer from "../../components/RepoAnalyzer/RepoAnalyzer";
import * as gitService from "../../services/gitService";
import MarkdownPreview from "../../components/MarkdownPreview/MarkdownPreview";
import "./dashboard.css";

export default function Dashboard() {
  const [currentPath, setCurrentPath] = useState("");
  const [repos, setRepos] = useState([]);
  const [repoData, setRepoData] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileContent, setFileContent] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadUserRepos() {
      try {
        const userRepos = await gitService.index();
        setRepos(userRepos);
      } catch (err) {
        setError("Failed to load repositories.");
      }
    }
    loadUserRepos();
  }, []);

  async function handleRepoClick(repo) {
    try {
      console.log("Clicked repo:", repo); // Debug log

      // Parse URL more reliably
      const url = new URL(repo.repo_url);
      const pathParts = url.pathname.split("/");
      // GitHub URLs are structured as github.com/owner/repo
      const owner = pathParts[1];
      const repoName = pathParts[2];

      console.log("Attempting analysis with:", { owner, repoName }); // Debug log

      const analysis = await gitService.analyzeRepo({ owner, repoName });
      console.log("Analysis result:", analysis); // Debug log

      setRepoData(analysis);
    } catch (err) {
      console.error("Analysis error:", err); // More detailed error
      setError(`Failed to analyze repository: ${err.message}`);
    }
  }

  async function handleAnalysis(data) {
    setRepoData(data);
  }

  async function handleFileSelect(item) {
    console.log("Selected item:", item);

    if (item.type === "dir") {
      // Handle directory click
      try {
        const contents = await gitService.getFileContent({
          owner: repoData.repository.owner.login,
          repo: repoData.repository.name,
          path: item.path, // Flip from file to item to avoid erroring out
        });
        setCurrentPath(item.path); // Added path state to track this for nav purposes
        setRepoData({
          ...repoData,
          contents: contents,
        });
      } catch (err) {
        setError("Failed to fetch directory contents");
      }
    } else {
      // Handle file click
      try {
        const content = await gitService.getFileContent({
          owner: repoData.repository.owner.login,
          repo: repoData.repository.name,
          path: item.path,
        });
        setSelectedFile(item);
        setFileContent(content);
      } catch (err) {
        setError("Failed to fetch file content");
      }
    }
  }
  async function handlePathClick(path) {
    try {
      const contents = await gitService.getFileContent({
        owner: repoData.repository.owner.login,
        repo: repoData.repository.name,
        path,
      });
      setCurrentPath(path);
      setRepoData({
        ...repoData,
        contents: contents,
      });
    } catch (err) {
      setError("Failed to navigate to directory");
    }
  }
  function renderBreadcrumbs() {
    if (!currentPath) return null;

    const parts = currentPath.split("/");
    return (
      <div className="breadcrumbs">
        <span onClick={() => handlePathClick("")}>root</span>
        {parts.map((part, index) => (
          <span key={index}>
            {" / "}
            <span
              onClick={() =>
                handlePathClick(parts.slice(0, index + 1).join("/"))
              }
              className="breadcrumb-item"
            >
              {part}
            </span>
          </span>
        ))}
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="user-repos">
        <h2>Your Repositories</h2>
        {repos.length > 0 ? (
          <ul className="repo-list">
            {repos.map((repo) => (
              <li
                key={repo._id}
                className="repo-item"
                onClick={() => handleRepoClick(repo)}
              >
                <h3 href={repo.repo_name}>{repo.repo_name}</h3>
                <p>
                  Last analyzed:{" "}
                  {new Date(repo.lastAnalyzed).toLocaleDateString()}
                </p>
                <div className="repo-meta">
                  <span>{repo.isPublic ? "Public" : "Private"}</span>
                  <a
                    href={repo.repo_url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View on GitHub
                  </a>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>
            No repositories analyzed yet. Use the analyzer above to add one.
          </p>
        )}
      </div>

      <RepoAnalyzer onAnalyze={handleAnalysis} />
      {error && <div className="error-message">{error}</div>}

      {repoData && (
        <div className="repo-content">
          <div className="file-tree">
            <h3>Files</h3>
            {renderBreadcrumbs()}
            {Array.isArray(repoData.contents) &&
              repoData.contents.map((item) => (
                <div
                  key={item.sha || item.path}
                  className={`file-item ${
                    item.type === "dir" ? "directory" : "file"
                  }`}
                  onClick={() => handleFileSelect(item)}
                >
                  <span className="item-icon">
                    {item.type === "dir" ? "folder: " : "file:"}
                  </span>
                  {item.name}
                </div>
              ))}
          </div>
          {selectedFile && fileContent && (
            <div className="file-content">
              <h3>{selectedFile.name}</h3>
              {selectedFile.name.endsWith(".md") ? (
                <MarkdownPreview markdown={fileContent.content} />
              ) : (
                <pre>
                  <code>{fileContent.content}</code>
                </pre>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
