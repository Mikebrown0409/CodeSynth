import "./FileTree.css";

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
      <div className="breadcrumbs">
        <span className="breadcrumb-item" onClick={() => onPathClick("")}>
          root
        </span>
        {parts.map((part, index) => (
          <span key={index}>
            {" / "}
            <span
              className="breadcrumb-item"
              onClick={() => onPathClick(parts.slice(0, index + 1).join("/"))}
            >
              {part}
            </span>
          </span>
        ))}
      </div>
    );
  }

  return (
    <div className="file-tree">
      <h3>Files</h3>
      {renderBreadcrumbs()}
      <div className="file-list">
        {Array.isArray(contents) &&
          contents.map((item) => (
            <div
              key={item.sha || item.path}
              className={`file-item ${
                item.type === "dir" ? "directory" : "file"
              }`}
              onClick={() => onFileSelect(item)}
            >
              <span className="item-icon">
                {item.type === "dir" ? "📁" : "📄"}
              </span>
              <span className="item-name">{item.name}</span>
            </div>
          ))}
      </div>
    </div>
  );
}
