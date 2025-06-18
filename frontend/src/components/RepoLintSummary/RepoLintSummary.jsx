import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { ChevronDown, ChevronRight, AlertTriangle, XCircle, CheckCircle } from "lucide-react";

export default function RepoLintSummary({ summary = [], messages = [] }) {
  const [selectedRule, setSelectedRule] = useState(null);

  const handleRuleClick = (ruleId) => {
    if (selectedRule === ruleId) {
      setSelectedRule(null);
    } else {
      setSelectedRule(ruleId);
    }
  };

  const totalErrors = summary.reduce((acc, rule) => acc + rule.count, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          {totalErrors === 0 ? (
            <>
              <CheckCircle className="h-5 w-5 text-green-500" />
              Lint Summary
            </>
          ) : (
            <>
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
              Lint Summary
            </>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {summary.length === 0 ? (
          <div className="text-center py-4">
            <CheckCircle className="mx-auto h-8 w-8 text-green-500 mb-2" />
            <p className="text-sm text-muted-foreground">No lint issues detected 🎉</p>
          </div>
        ) : (
          <div className="space-y-2">
            {summary.map((rule) => {
              const isSelected = selectedRule === rule.ruleId;
              const isError = rule.severity === 2;
              
              return (
                <div key={rule.ruleId} className="border rounded-md">
                  <Button
                    variant="ghost"
                    className="w-full justify-between p-3 h-auto"
                    onClick={() => handleRuleClick(rule.ruleId)}
                  >
                    <div className="flex items-center gap-3">
                      {isError ? (
                        <XCircle className="h-4 w-4 text-red-500" />
                      ) : (
                        <AlertTriangle className="h-4 w-4 text-yellow-500" />
                      )}
                      <span className="font-mono text-sm">{rule.ruleId}</span>
                      <Badge variant={isError ? "destructive" : "secondary"}>
                        {rule.count}
                      </Badge>
                    </div>
                    {isSelected ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </Button>
                  
                  {isSelected && (
                    <div className="border-t bg-muted/50 p-3">
                      <h4 className="font-medium text-sm mb-2">
                        First occurrences of {selectedRule}
                      </h4>
                      <div className="space-y-1 max-h-40 overflow-y-auto">
                        {messages
                          .filter((m) => (m.ruleId || m.message) === selectedRule)
                          .slice(0, 50)
                          .map((m, idx) => (
                            <div key={idx} className="text-xs text-muted-foreground">
                              <span className="font-mono bg-background px-1 rounded">
                                {m.file}
                              </span>
                              : line {m.line} – {m.message}
                            </div>
                          ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
} 