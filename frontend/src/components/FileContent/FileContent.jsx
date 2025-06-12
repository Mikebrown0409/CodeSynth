import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import "./FileContent.css";

export default function FileContent({ file, content }) {
  if (!file || !content) return null;

  return (
    <div className="file-content">
      <h3>{file.name}</h3>
      {content.lintResults &&
        content.lintResults.length > 0 && ( // lint addition
          <div className="lint-results">
            <h4>Lint Issues:</h4>
            {content.lintResults.map((issue, index) => (
              <div
                key={index}
                className={`lint-issue ${
                  issue.severity === 2 ? "error" : "warning"
                }`}
              >
                <span className="line-number">Line {issue.line}:</span>
                <span className="message">{issue.message}</span>
                {issue.ruleId && (
                  <span className="rule-id">({issue.ruleId})</span>
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
