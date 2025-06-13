import { useState } from "react";
import * as gitService from "../../services/gitService";

export default function RepoAnalyzer({ onAnalyze }) {
  const [repoUrl, setRepoUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleAnalyze(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const url = new URL(repoUrl);
      const pathParts = url.pathname.split("/").filter(Boolean);

      if (pathParts.length !== 2) {
        throw new Error("Invalid repository URL format");
      }

      const [owner, repoName] = pathParts;
      const response = await gitService.analyzeRepo({ owner, repoName });
      onAnalyze(response);
    } catch (err) {
      setError(err.message);
      console.error("Analysis error:", err);
    } finally {
      setLoading(false);
    }
  }
  return (
    <div className="repo-analyzer">
      <div className="analyzer-input">
        <h2>Analyze GitHub Repository</h2>
        <form onSubmit={handleAnalyze}>
          <input
            type="url"
            value={repoUrl}
            onChange={(e) => setRepoUrl(e.target.value)}
            placeholder="https://github.com/username/repository"
            required
            className="repo-input"
          />
          <button type="submit" disabled={loading}>
            {loading ? "Analyzing..." : "Analyze"}
          </button>
        </form>
        {error && (
          <div
            className="error-message"
            style={{ color: "red", marginTop: "10px" }}
          >
            {error}
          </div>
        )}
      </div>
    </div>
  );
}
