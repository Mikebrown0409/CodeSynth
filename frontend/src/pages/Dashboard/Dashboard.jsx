import { useState, useEffect } from "react";
import RepoAnalyzer from "../../components/RepoAnalyzer/RepoAnalyzer";
import FileTree from "../../components/FileTree/FileTree";
import FileContent from "../../components/FileContent/FileContent";
import RepoList from "../../components/RepoList/RepoList";
import * as gitService from "../../services/gitService";
import RepoLintSummary from "../../components/RepoLintSummary/RepoLintSummary";
import NavBar from "../../components/Layout/NavBar";
import { Card, CardContent } from "../../components/ui/card";
import { Code2 } from "lucide-react";

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
      console.log("Clicked repo:", repo);

      const url = new URL(repo.repo_url);
      const pathParts = url.pathname.split("/");
      const owner = pathParts[1];
      const repoName = pathParts[2];

      console.log("Attempting analysis with:", { owner, repoName });

      const analysis = await gitService.analyzeRepo({ owner, repoName });
      console.log("Analysis result:", analysis);

      setRepoData(analysis);
      setCurrentPath("");
      setSelectedFile(null);
      setFileContent(null);
    } catch (err) {
      console.error("Analysis error:", err);
      setError(`Failed to analyze repository: ${err.message}`);
    }
  }

  async function handleAnalysis(data) {
    setRepoData(data);
    setCurrentPath("");
    setSelectedFile(null);
    setFileContent(null);
  }

  async function handleFileSelect(item) {
    console.log("Selected item:", item);

    if (item.type === "dir") {
      try {
        const contents = await gitService.getFileContent({
          owner: repoData.repository.owner.login,
          repo: repoData.repository.name,
          path: item.path,
        });
        setCurrentPath(item.path);
        setRepoData({
          ...repoData,
          contents: contents,
        });
      } catch (err) {
        setError("Failed to fetch directory contents");
      }
    } else {
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
      setRepos(repos.filter((repo) => repo._id !== repoId));
      if (repoData && repoData.savedRepo._id === repoId) {
        setRepoData(null);
        setSelectedFile(null);
        setFileContent(null);
        setCurrentPath("");
      }
    } catch (err) {
      console.error("Failed to delete repo:", err);
      setError("Failed to delete repository");
    }
  }

  return (
    <div className="flex flex-col h-screen bg-background text-foreground">
      {/* Header */}
      <NavBar />
      
      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar */}
        <div className="w-80 border-r border-border bg-card overflow-y-auto">
          <div className="p-4 border-b border-border">
            <RepoAnalyzer onAnalyze={handleAnalysis} compact />
            {error && (
              <div className="mt-4 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md p-3">
                {error}
              </div>
            )}
          </div>
          <div className="p-4">
            <RepoList
              repos={repos}
              onRepoClick={handleRepoClick}
              onDeleteClick={handleDeleteClick}
            />
          </div>
        </div>
        
        {/* Main Content Area */}
        {!repoData ? (
          /* Welcome Screen */
          <div className="flex-1 flex items-center justify-center p-8">
            <div className="w-full max-w-2xl space-y-8">
              <div className="text-center space-y-4">
                <div className="flex items-center justify-center mb-6">
                  <div className="p-3 rounded-full bg-primary/10 border border-primary/20">
                    <Code2 className="h-8 w-8 text-primary" />
                  </div>
                </div>
                <h1 className="text-4xl font-bold tracking-tight">
                  Welcome to CodeSynth
                </h1>
                <p className="text-xl text-muted-foreground">
                  Analyze GitHub repositories for code quality and lint issues. 
                  Discover potential improvements and maintain clean, consistent code.
                </p>
              </div>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center text-muted-foreground">
                    <p>
                      {repos.length === 0 
                        ? "No repositories analyzed yet. Use the analyzer in the sidebar to get started."
                        : "Select a repository from the sidebar to view its analysis, or add a new one using the analyzer above."
                      }
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        ) : (
          /* Repository Analysis View */
          <>
            {/* Middle Panel */}
            <div className="w-80 border-r border-border bg-card overflow-y-auto">
              <div className="p-4 space-y-4">
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
              </div>
            </div>
            
            {/* Right Panel */}
            <div className="flex-1 overflow-y-auto bg-background">
              <FileContent
                file={selectedFile}
                content={fileContent}
                owner={repoData?.repository?.owner?.login}
                repo={repoData?.repository?.name}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
