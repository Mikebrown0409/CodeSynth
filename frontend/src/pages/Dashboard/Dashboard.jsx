import { useState } from "react";
import RepoAnalyzer from "../../components/RepoAnalyzer/RepoAnalyzer";
import * as gitService from "../../services/gitService";
import "./dashboard.css";

export default function Dashboard() {
  const [repoData, setRepoData] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileContent, setFileContent] = useState(null);
  const [error, setError] = useState("");

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
        </div>
      )}
    </div>
  );
}
