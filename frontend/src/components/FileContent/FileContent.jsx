import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import "./FileContent.css";
import { useState } from "react";

export default function FileContent({ file, content }) {
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

  return (
    <div className="file-content">
      <h3>{file.name}</h3>
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
