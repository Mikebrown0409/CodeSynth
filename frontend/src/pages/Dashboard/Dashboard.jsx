import { useState, useEffect } from "react";
import RepoAnalyzer from "../../components/RepoAnalyzer/RepoAnalyzer";
import FileTree from "../../components/FileTree/FileTree";
import FileContent from "../../components/FileContent/FileContent";
import RepoList from "../../components/RepoList/RepoList";
import * as gitService from "../../services/gitService";
import RepoLintSummary from "../../components/RepoLintSummary/RepoLintSummary";
import NavBar from "../../components/Layout/NavBar";
import Sidebar from "../../components/Layout/Sidebar";

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
        const response = await gitService.getFileContent({
          owner: repoData.repository.owner.login,
          repo: repoData.repository.name,
          path: item.path,
        });
        setSelectedFile(item);
        setFileContent(response);
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

  async function handleDeleteClick(repoId) {
    try {
      await gitService.deleteRepo(repoId);
      // Remove the deleted repo from state
      setRepos(repos.filter((repo) => repo._id !== repoId));
      // Clear repo data
      if (repoData && repoData.savedRepo._id === repoId) {
        setRepoData(null);
        setSelectedFile(null);
        setFileContent(null);
      }
    } catch (err) {
      console.error("Failed to delete repo:", err);
      setError("Failed to delete repository");
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />
      <div className="flex flex-1">
        <Sidebar>
          <h2 className="text-md font-semibold mb-2">Your Repositories</h2>
          <RepoList
            repos={repos}
            onRepoClick={handleRepoClick}
            onDeleteClick={handleDeleteClick}
          />
        </Sidebar>
        <main className="flex-1 p-6">
          <RepoAnalyzer onAnalyze={handleAnalysis} />
          {error && <div className="error-message">{error}</div>}

          {repoData && (
            <div className="repo-content">
              {repoData.lintSummary && (
                <RepoLintSummary
                  summary={repoData.lintSummary}
                  messages={repoData.lintMessages || []}
                />
              )}
              <FileTree
                contents={repoData.contents}
                currentPath={currentPath}
                onFileSelect={handleFileSelect}
                onPathClick={handlePathClick}
              />
              <FileContent
                file={selectedFile}
                content={fileContent}
                owner={repoData?.repository?.owner?.login}
                repo={repoData?.repository?.name}
              />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
