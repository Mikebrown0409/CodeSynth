import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { useState } from "react";
import * as gitService from "../../services/gitService";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { ChevronDown, ChevronRight, File, Wrench, AlertTriangle, XCircle } from "lucide-react";

export default function FileContent({ file, content, owner, repo }) {
  if (!file || !content) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        <div className="text-center">
          <File className="mx-auto h-12 w-12 mb-4" />
          <p>Select a file to view its contents</p>
        </div>
      </div>
    );
  }

  // Group lint results by rule/message
  const groupedLint = (content.lintResults || []).reduce((acc, issue) => {
    const key = issue.ruleId || issue.message;
    if (!acc[key]) {
      acc[key] = { ...issue, occurrences: [] };
    }
    acc[key].occurrences.push(issue);
    return acc;
  }, {});

  const [openRule, setOpenRule] = useState(null);
  const [fixing, setFixing] = useState(false);

  async function handleAutoFix() {
    if (!owner || !repo || !file?.path) return;
    try {
      setFixing(true);
      const res = await gitService.fixFile({ owner, repo, path: file.path });
      content.content = res.fixedCode;
      content.lintResults = res.messages;
      setOpenRule(null);
    } catch (err) {
      console.error("Auto-fix failed", err);
      alert("Auto-fix failed: " + err.message);
    } finally {
      setFixing(false);
    }
  }

  const extension = file.name.split(".").pop().toLowerCase();

  return (
    <div className="h-full flex flex-col">
      <div className="border-b bg-background p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <File className="h-5 w-5" />
            {file.name}
          </h3>
          {content.lintResults && content.lintResults.length > 0 && (
            <Button onClick={handleAutoFix} disabled={fixing} className="gap-2">
              <Wrench className="h-4 w-4" />
              {fixing ? "Fixing..." : "Auto Fix"}
            </Button>
          )}
        </div>

        {Object.keys(groupedLint).length > 0 && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-yellow-500" />
                Lint Issues ({Object.keys(groupedLint).length} rules)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {Object.entries(groupedLint).map(([key, group]) => {
                const isOpen = openRule === key;
                const isError = group.severity === 2;
                
                return (
                  <div key={key} className="border rounded-md">
                    <Button
                      variant="ghost"
                      className="w-full justify-between p-3 h-auto"
                      onClick={() => setOpenRule(prev => prev === key ? null : key)}
                    >
                      <div className="flex items-center gap-2">
                        {isError ? (
                          <XCircle className="h-4 w-4 text-red-500" />
                        ) : (
                          <AlertTriangle className="h-4 w-4 text-yellow-500" />
                        )}
                        <span className="font-mono text-sm">{group.ruleId || "Other"}</span>
                        <Badge variant={isError ? "destructive" : "secondary"}>
                          {group.occurrences.length}
                        </Badge>
                      </div>
                      {isOpen ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </Button>
                    
                    {isOpen && (
                      <div className="border-t bg-muted/50 p-3">
                        <div className="space-y-1 max-h-32 overflow-y-auto">
                          {group.occurrences.map((occ, idx) => (
                            <div key={idx} className="text-xs text-muted-foreground">
                              Line {occ.line}: {occ.message}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </CardContent>
          </Card>
        )}
      </div>

      <div className="flex-1 overflow-auto">
        <SyntaxHighlighter
          language={extension === "jsx" ? "javascript" : extension}
          style={vscDarkPlus}
          showLineNumbers={true}
          wrapLines={true}
          customStyle={{
            margin: 0,
            background: 'transparent',
            fontSize: '14px',
          }}
          lineProps={(lineNumber) => {
            const issue = content.lintResults?.find(
              (i) => i.line === lineNumber
            );
            return {
              style: {
                backgroundColor: issue
                  ? issue.severity === 2
                    ? "#ff000020"
                    : "#ffff0020"
                  : undefined,
              },
            };
          }}
        >
          {content.content}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}
