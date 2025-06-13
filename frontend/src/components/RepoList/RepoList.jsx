import "./RepoList.css";

export default function RepoList({ repos, onRepoClick, onDeleteClick }) {
  if (!repos.length) {
    return (
      <p>No repositories analyzed yet. Add a repository to get started.</p>
    );
  }

  return (
    <ul className="repo-list">
      {repos.map((repo) => (
        <li key={repo._id} className="repo-item">
          <div onClick={() => onRepoClick(repo)}>{repo.repo_name}</div>
          <button
            className="delete-btn"
            onClick={(e) => {
              e.stopPropagation(); // Prevent repo click
              onDeleteClick(repo._id);
            }}
          >
            Delete
          </button>
        </li>
      ))}
    </ul>
  );
}
