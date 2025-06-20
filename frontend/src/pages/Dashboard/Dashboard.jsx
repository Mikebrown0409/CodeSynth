import { useState, useEffect } from "react";
import { useLocation } from "react-router";
import RepoAnalyzer from "../../components/RepoAnalyzer/RepoAnalyzer";
import FileTree from "../../components/FileTree/FileTree";
import FileContent from "../../components/FileContent/FileContent";
import RepoList from "../../components/RepoList/RepoList";
import * as gitService from "../../services/gitService";
import * as favoriteService from "../../services/favoriteService";
import RepoLintSummary from "../../components/RepoLintSummary/RepoLintSummary";
import NavBar from "../../components/Layout/NavBar";
import { Card, CardContent } from "../../components/ui/card";
import { Code2 } from "lucide-react";
import { Button } from "../../components/ui/button";

export default function Dashboard() {
  const location = useLocation();
  const [currentPath, setCurrentPath] = useState("");
  const [repos, setRepos] = useState([]);
  const [repoData, setRepoData] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileContent, setFileContent] = useState(null);
  const [error, setError] = useState("");
  const [showIssueOnly, setShowIssueOnly] = useState(false);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    async function loadUserRepos() {
      try {
        const [userRepos, favs] = await Promise.all([
          gitService.index(),
          favoriteService.getFavorites()
        ]);
        setRepos(userRepos);
        setFavorites(favs.map(f => f.repo._id));
      } catch (err) {
        setError("Failed to load repositories.");
      }
    }
    loadUserRepos();
  }, []);

  // Handle pending repo URL from OAuth flow or route state
  useEffect(() => {
    async function handlePendingRepo() {
      const pendingRepo = localStorage.getItem('pendingRepoUrl');
      const routeRepo = location.state?.repoUrl;
      const routeRepoInfo = location.state?.repoInfo;
      
      if (pendingRepo || routeRepo) {
        const repoUrl = pendingRepo || routeRepo;
        localStorage.removeItem('pendingRepoUrl');
        
        try {
          let owner, repoName;
          
          if (routeRepoInfo) {
            // Use parsed repo info from route state
            owner = routeRepoInfo.owner;
            repoName = routeRepoInfo.repoName;
          } else {
            // Parse the GitHub URL
            const url = new URL(repoUrl);
            const pathParts = url.pathname.split("/").filter(Boolean);
            
            if (pathParts.length >= 2) {
              owner = pathParts[0];
              repoName = pathParts[1];
            }
          }
          
          if (owner && repoName) {
    
            const analysis = await gitService.analyzeRepo({ owner, repoName });
            setRepoData(analysis);
            // Ensure the analyzed repo appears in the sidebar list
            if (analysis.savedRepo) {
              setRepos((prev) => {
                const exists = prev.some((r) => r._id === analysis.savedRepo._id);
                return exists ? prev : [...prev, analysis.savedRepo];
              });
            }
            setCurrentPath("");
            setSelectedFile(null);
            setFileContent(null);
          }
        } catch (err) {
          // Failed to auto-analyze repo
          setError(`Failed to analyze repository: ${err.message}`);
        }
      }
    }
    
    handlePendingRepo();
  }, [location.state]);

  async function handleRepoClick(repo) {
    try {
  

      const url = new URL(repo.repo_url);
      const pathParts = url.pathname.split("/");
      const owner = pathParts[1];
      const repoName = pathParts[2];

      const analysis = await gitService.analyzeRepo({ owner, repoName });

      setRepoData(analysis);
      // Ensure the analyzed repo appears in the sidebar list
      if (analysis.savedRepo) {
        setRepos((prev) => {
          const exists = prev.some((r) => r._id === analysis.savedRepo._id);
          return exists ? prev : [...prev, analysis.savedRepo];
        });
      }
      setCurrentPath("");
      setSelectedFile(null);
      setFileContent(null);
    } catch (err) {
      // Analysis error
      setError(`Failed to analyze repository: ${err.message}`);
    }
  }

  async function handleAnalysis(repoInfo) {
    try {
  
      const analysis = await gitService.analyzeRepo(repoInfo);
      setRepoData(analysis);
      // Ensure the analyzed repo appears in the sidebar list
      if (analysis.savedRepo) {
        setRepos((prev) => {
          const exists = prev.some((r) => r._id === analysis.savedRepo._id);
          return exists ? prev : [...prev, analysis.savedRepo];
        });
      }
      setCurrentPath("");
      setSelectedFile(null);
      setFileContent(null);
    } catch (err) {
      // Analysis error
      setError(`Failed to analyze repository: ${err.message}`);
    }
  }

  async function handleFileSelect(item) {


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
      // Failed to delete repo
      setError("Failed to delete repository");
    }
  }

  function filterContents(contentsList) {
    if (!showIssueOnly || !repoData || !repoData.lintMessages) return contentsList;
    const issuePaths = new Set(repoData.lintMessages.map(m => m.file));
    return contentsList.filter(item => {
      if (item.type === 'dir') {
        return Array.from(issuePaths).some(p => p.startsWith(item.path + '/'));
      } else {
        return issuePaths.has(item.path);
      }
    });
  }

  async function handleToggleFavorite(repoId) {
    try {
      await favoriteService.toggleFavorite(repoId);
      setFavorites(prevFavorites => {
        if (prevFavorites.includes(repoId)) {
          return prevFavorites.filter(id => id !== repoId);
        } else {
          return [...prevFavorites, repoId];
        }
      });
    } catch (err) {
      setError("Failed to toggle favorite");
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
              favorites={favorites}
              onRepoClick={handleRepoClick}
              onDeleteClick={handleDeleteClick}
              onToggleFavorite={handleToggleFavorite}
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
                {repoData && (
                  <div className="flex gap-2 mb-2">
                    <Button
                      size="sm"
                      variant={showIssueOnly ? "ghost" : "default"}
                      onClick={() => setShowIssueOnly(false)}
                    >All</Button>
                    <Button
                      size="sm"
                      variant={showIssueOnly ? "default" : "ghost"}
                      onClick={() => setShowIssueOnly(true)}
                    >With Issues</Button>
                  </div>
                )}
                {repoData.lintSummary && (
                  <RepoLintSummary
                    summary={repoData.lintSummary}
                    messages={repoData.lintMessages || []}
                  />
                )}
                <FileTree
                  contents={filterContents(repoData.contents)}
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
