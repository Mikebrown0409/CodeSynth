import { useState } from "react";
import RepoAnalyzer from "../../components/RepoAnalyzer/RepoAnalyzer";
import * as gitService from "../../services/gitService";

export default function Dashboard() {
  const [repoData, setRepoData] = useState(null);
  const [error, setError] = useState("");

  async function handleAnalysis() {
    try {
      const data = await gitService.analyzeRepo(analysisData);
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

      {error && <p className="error-message">{error}</p>}

      {repoData && (
        <div className="repo-results">
          <h2>{repoData.repository?.name}</h2>
          <div className="lint-results">
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
