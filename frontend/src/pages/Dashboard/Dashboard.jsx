import { useState, useEffect } from "react";
import RepoAnalyzer from "../../components/RepoAnalyzer/RepoAnalyzer";
import * as gitService from "../../services/gitService";
import MarkdownPreview from '../../components/MarkdownPreview/MarkdownPreview';
import "./dashboard.css";

export default function Dashboard() {
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

  async function handleFileSelect(file) {
    console.log(" Attempting to fetch file:", file);
    console.log(" Current repoData:", repoData);
    try {
      const content = await gitService.getFileContent({
        owner: repoData.repository.owner.login,
        repo: repoData.repository.name,
        path: file.path,
      });
      setSelectedFile(file);
      setFileContent(content);
    } catch (err) {
      setError("Failed to fetch file content");
    }
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
                <h3 href={repo.repo_name}>Repo: {repo.repo_name}</h3>
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
            {console.log("Folder Contents to render:", repoData.contents)}{" "}
            {Array.isArray(repoData.contents) &&
              repoData.contents.map((file) => (
                <div
                  key={file.sha || file.path}
                  className="file-item"
                  onClick={() => {
                    console.log(" File clicked:", file); // Debug log
                    handleFileSelect(file);
                  }}
                >
                  {file.name}
                </div>
              ))}
          </div>
          {selectedFile && fileContent && (
            <div className="file-content">
              <h3>{selectedFile.name}</h3>
              {selectedFile.name.endsWith('.md') ? (
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
