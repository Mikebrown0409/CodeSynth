import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import MarkdownPreview from "../MarkdownPreview/MarkdownPreview";
// import "./FileContent.css";

export default function FileContent({ file, content }) {
  if (!file || !content) return null;

  return (
    <div className="file-content">
      <h3>{file.name}</h3>
      {(() => {
        const extension = file.name.split(".").pop().toLowerCase();

        switch (extension) {
          case "md":
            return <MarkdownPreview markdown={content.content} />;
          case "js":
          case "jsx":
            return (
              <SyntaxHighlighter language="javascript" style={vscDarkPlus}>
                {content.content}
              </SyntaxHighlighter>
            );
          case "ts":
          case "tsx":
            return (
              <SyntaxHighlighter language="typescript" style={vscDarkPlus}>
                {content.content}
              </SyntaxHighlighter>
            );
          case "css":
            return (
              <SyntaxHighlighter language="css" style={vscDarkPlus}>
                {content.content}
              </SyntaxHighlighter>
            );
          case "json":
            return (
              <SyntaxHighlighter language="json" style={vscDarkPlus}>
                {content.content}
              </SyntaxHighlighter>
            );
          case "html":
            return (
              <SyntaxHighlighter language="html" style={vscDarkPlus}>
                {content.content}
              </SyntaxHighlighter>
            );
          default:
            return (
              <pre>
                <code>{content.content}</code>
              </pre>
            );
        }
      })()}
    </div>
  );
}
