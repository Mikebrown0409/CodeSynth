import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { Trash2, FolderGit2 } from "lucide-react";

export default function RepoList({ repos, onRepoClick, onDeleteClick }) {
  if (!repos.length) {
    return (
      <div className="text-center py-8">
        <FolderGit2 className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <p className="text-sm text-muted-foreground">
          No repositories analyzed yet.
          <br />
          Add a repository to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
          Repositories
        </h3>
        <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
          {repos.length}
        </span>
      </div>
      {repos.map((repo) => (
        <Card
          key={repo._id}
          className="p-3 hover:bg-accent hover:shadow-md cursor-pointer transition-all duration-200 border-l-2 border-l-transparent hover:border-l-primary"
          onClick={() => onRepoClick(repo)}
        >
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">
                {repo.repo_name}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="secondary" className="text-xs">
                  {repo.lintSummary?.totalFiles || 0} files
                </Badge>
                {repo.lintSummary?.totalErrors > 0 && (
                  <Badge variant="destructive" className="text-xs">
                    {repo.lintSummary.totalErrors} errors
                  </Badge>
                )}
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-destructive"
              onClick={(e) => {
                e.stopPropagation();
                onDeleteClick(repo._id);
              }}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
}
