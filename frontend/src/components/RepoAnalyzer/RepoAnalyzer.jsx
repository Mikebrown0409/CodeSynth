import { useState } from "react";
import * as gitService from "../../services/gitService";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Search, Github, Plus } from "lucide-react";

export default function RepoAnalyzer({ onAnalyze, compact = false }) {
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
      // Pass the parsed repo info to parent component
      // Parent will handle authentication and API call
      onAnalyze({ owner, repoName }, repoUrl);
      setRepoUrl("");
    } catch (err) {
      setError(err.message);
      // Analysis error
    } finally {
      setLoading(false);
    }
  }

  if (compact) {
    return (
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm font-medium">
          <Plus className="h-4 w-4" />
          Add Repository
        </div>
        <form onSubmit={handleAnalyze} className="space-y-3">
          <Input
            type="url"
            value={repoUrl}
            onChange={(e) => setRepoUrl(e.target.value)}
            placeholder="https://github.com/owner/repo"
            required
            className="text-sm"
          />
          <Button type="submit" disabled={loading} className="w-full" size="sm">
            {loading ? (
              <>
                <Search className="mr-2 h-3 w-3 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Search className="mr-2 h-3 w-3" />
                Analyze
              </>
            )}
          </Button>
          {error && (
            <div className="text-xs text-destructive bg-destructive/10 border border-destructive/20 rounded-md p-2">
              {error}
            </div>
          )}
        </form>
      </div>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto mb-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Github className="h-5 w-5" />
          Analyze Repository
        </CardTitle>
        <CardDescription>
          Enter a GitHub repository URL to analyze code quality and lint issues
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleAnalyze} className="space-y-4">
          <div className="flex gap-2">
            <Input
              type="url"
              value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value)}
              placeholder="https://github.com/username/repository"
              required
              className="flex-1"
            />
            <Button type="submit" disabled={loading} className="px-8">
              {loading ? (
                <>
                  <Search className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Search className="mr-2 h-4 w-4" />
                  Analyze
                </>
              )}
            </Button>
          </div>
          {error && (
            <div className="text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md p-3">
              {error}
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
