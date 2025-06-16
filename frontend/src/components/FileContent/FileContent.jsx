import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import "./FileContent.css";
import { useState } from "react";
import * as gitService from "../../services/gitService";

export default function FileContent({ file, content, owner, repo }) {
  if (!file || !content) return null;

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
      // Update content with fixed code and new lint messages
      content.content = res.fixedCode;
      content.lintResults = res.messages;
      setOpenRule(null); // collapse groups after fix
    } catch (err) {
      console.error("Auto-fix failed", err);
      alert("Auto-fix failed: " + err.message);
    } finally {
      setFixing(false);
    }
  }

  return (
    <div className="file-content">
      <h3>{file.name}</h3>
      {content.lintResults && content.lintResults.length > 0 && (
        <button className="fix-btn" onClick={handleAutoFix} disabled={fixing}>
          {fixing ? "Fixing..." : "Auto Fix"}
        </button>
      )}
      {Object.keys(groupedLint).length > 0 && (
        <div className="lint-results">
          <h4>Lint Issues:</h4>
          {Object.entries(groupedLint).map(([key, group]) => (
            <div key={key} className="lint-group">
              <div
                className={`lint-group-header ${
                  group.severity === 2 ? "error" : "warning"
                }`}
                onClick={() =>
                  setOpenRule((prev) => (prev === key ? null : key))
                }
              >
                <span className="rule-id">{group.ruleId || "Other"}</span>
                <span className="count">({group.occurrences.length})</span>
              </div>
              {openRule === key && (
                <div className="lint-occurrences">
                  {group.occurrences.map((occ, idx) => (
                    <div key={idx} className="lint-issue-item">
                      Line {occ.line}:{" "}
                      {occ.message}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      <div className="code-container">
        {(() => {
          // syntax highlight starts
          const extension = file.name.split(".").pop().toLowerCase();
          return (
            <SyntaxHighlighter
              language={extension === "jsx" ? "javascript" : extension}
              style={vscDarkPlus}
              showLineNumbers={true}
              wrapLines={true}
              lineProps={(lineNumber) => {
                const issue = content.lintResults?.find(
                  (i) => i.line === lineNumber
                );
                return {
                  style: {
                    backgroundColor: issue
                      ? issue.severity === 2
                        ? "#ff000020"
                        : "#ffff0020" // hex easier
                      : undefined,
                  },
                };
              }}
            >
              {content.content}
            </SyntaxHighlighter>
          );
        })()}
      </div>
    </div>
  );
}
