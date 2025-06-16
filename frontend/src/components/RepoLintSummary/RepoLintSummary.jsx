import { useState } from "react";
import "./RepoLintSummary.css";

export default function RepoLintSummary({ summary = [], messages = [] }) {
  const [selectedRule, setSelectedRule] = useState(null);

  const handleRuleClick = (ruleId) => {
    if (selectedRule === ruleId) {
      setSelectedRule(null);
    } else {
      setSelectedRule(ruleId);
    }
  };

  return (
    <div className="repo-lint-summary">
      <h3>Repository Lint Summary</h3>
      {summary.length === 0 ? (
        <p>No lint issues detected 🎉</p>
      ) : (
        <table className="lint-summary-table">
          <thead>
            <tr>
              <th>Rule</th>
              <th>Severity</th>
              <th>Occurrences</th>
            </tr>
          </thead>
          <tbody>
            {summary.map((rule) => (
              <tr
                key={rule.ruleId}
                className={
                  selectedRule === rule.ruleId ? "selected" : undefined
                }
                onClick={() => handleRuleClick(rule.ruleId)}
              >
                <td>{rule.ruleId}</td>
                <td>{rule.severity === 2 ? "Error" : "Warning"}</td>
                <td>{rule.count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {selectedRule && (
        <div className="rule-details">
          <h4>First occurrences of {selectedRule}</h4>
          <ul>
            {messages
              .filter((m) => (m.ruleId || m.message) === selectedRule)
              .slice(0, 50) // limit to safeguard large lists
              .map((m, idx) => (
                <li key={idx}>
                  <code>{m.file}</code>: line {m.line} – {m.message}
                </li>
              ))}
          </ul>
        </div>
      )}
    </div>
  );
} 