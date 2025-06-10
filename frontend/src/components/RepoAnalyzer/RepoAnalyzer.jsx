import { useState } from "react";
import * as gitService from "../../services/gitService";

export default function RepoAnalyzer({ onAnalyze }) {
  const [repoUrl, setRepoUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleAnalyze(e) {
    e.preventDefault();
    setLoading(true);

    try {
      const url = new URL(repoUrl);
      const [, owner, repo] = url.pathname.split("/");
      const response = await gitService.analyzeRepo({ owner, repo });
      console.log(response); // for development/testing, need to remove later on.
      onAnalyze(response);
    } catch (err) {
      setError(err.message);
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
      </div>
    </div>
  );
}
