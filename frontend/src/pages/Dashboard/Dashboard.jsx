import { useState } from "react";
import RepoAnalyzer from "../../components/RepoAnalyzer/RepoAnalyzer";
import * as gitService from "../../services/gitService";
import "./dashboard.css";

export default function Dashboard() {
  const [repoData, setRepoData] = useState(null);
  const [error, setError] = useState("");

  async function handleAnalysis(repoData) {
    try {
      const data = await gitService.analyzeRepo(repoData);
      setRepoData(data);
      setError("");
    } catch (err) {
      setError("Failed to analyze repository");
      console.log(err);
    }
  }
  return (
    <div className="dashboard-container">
      <h1>Repository Analysis</h1>
      <RepoAnalyzer onAnalyze={handleAnalysis} />

      {repoData && (
        <div className="repo-content">
          <div className="file-tree">
            <h3>Repository Files</h3>
            {repoData.contents.map((item) => (
              <div key={item.sha} className="file-item">
                <span className="file-icon">
                  {item.type === "dir" ? "folder" : "file"}
                </span>
                <span className="file-name">{item.name}</span>
                {item.type === "file" && (
                  <span className="file-issues">
                    {
                      repoData.lintingIssues.filter(
                        (issue) => issue.file === item.path
                      ).length
                    }{" "}
                    issues
                  </span>
                )}
              </div>
            ))}
          </div>

          <div className="analysis-results">
            {repoData.lintResults?.map((file, idx) => (
              <div key={idx} className="file-result">
                <h3>{file.file}</h3>
                <ul>
                  {file.issues?.map((issue, i) => (
                    <li key={i}>
                      Line {issue.line}: {issue.message}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
