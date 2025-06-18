import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { ChevronRight, File, Folder, Home } from "lucide-react";

export default function FileTree({
  contents,
  currentPath,
  onFileSelect,
  onPathClick,
}) {
  function renderBreadcrumbs() {
    if (!currentPath) return null;

    const parts = currentPath.split("/");
    return (
      <div className="flex items-center space-x-1 text-sm text-muted-foreground mb-4">
        <Button
          variant="ghost"
          size="sm"
          className="h-6 px-2 text-muted-foreground hover:text-foreground"
          onClick={() => onPathClick("")}
        >
          <Home className="h-3 w-3 mr-1" />
          root
        </Button>
        {parts.map((part, index) => (
          <div key={index} className="flex items-center space-x-1">
            <ChevronRight className="h-3 w-3" />
            <Button
              variant="ghost"
              size="sm"
              className="h-6 px-2 text-muted-foreground hover:text-foreground"
              onClick={() => onPathClick(parts.slice(0, index + 1).join("/"))}
            >
              {part}
            </Button>
          </div>
        ))}
      </div>
    );
  }

  if (!Array.isArray(contents) || contents.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Files</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">No files to display</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Files</CardTitle>
      </CardHeader>
      <CardContent>
        {renderBreadcrumbs()}
        <div className="space-y-1">
          {contents.map((item) => (
            <Button
              key={item.sha || item.path}
              variant="ghost"
              className="w-full justify-start h-auto p-2 text-left"
              onClick={() => onFileSelect(item)}
            >
              <div className="flex items-center space-x-2">
                {item.type === "dir" ? (
                  <Folder className="h-4 w-4 text-blue-500" />
                ) : (
                  <File className="h-4 w-4 text-muted-foreground" />
                )}
                <span className="text-sm">{item.name}</span>
              </div>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
