import "./RepoList.css";

export default function RepoList({ repos, onRepoClick }) {
  if (!repos.length) {
    return (
      <p>No repositories analyzed yet. Add a repository to get started.</p>
    );
  }

  return (
    <ul className="repo-list">
      {repos.map((repo) => (
        <li key={repo._id} onClick={() => onRepoClick(repo)}>
          <h3 className="repo-item">{repo.repo_name}</h3>
          <p>
            Last analyzed: {new Date(repo.lastAnalyzed).toLocaleDateString()}
          </p>
          <div className="repo-meta">
            <span>{repo.isPublic ? "Public" : "Private"}</span>
          </div>
        </li>
      ))}
    </ul>
  );
}
