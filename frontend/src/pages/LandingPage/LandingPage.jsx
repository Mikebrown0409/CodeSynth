import { useNavigate } from "react-router";
import RepoAnalyzer from "../../components/RepoAnalyzer/RepoAnalyzer";
import PublicHeader from "../../components/Layout/PublicHeader";
import { getUser } from "../../services/authService";

export default function LandingPage() {
  const navigate = useNavigate();
  const user = getUser();

  function handleAnalyze(_analysis, repoUrl) {
    if (!user) {
      navigate(`/signup?next=${encodeURIComponent(repoUrl)}`);
    } else {
      navigate("/dashboard");
    }
  }

  return (
    <div className="relative min-h-screen flex flex-col bg-background text-foreground overflow-hidden">
      <PublicHeader />

      {/* Gradient backdrop */}
      <div className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center">
        <div className="h-[120vh] w-[120vh] rounded-full bg-gradient-to-br from-cyan-500/10 via-fuchsia-500/10 to-transparent blur-3xl opacity-20 animate-[spin_40s_linear_infinite]" />
      </div>

      {/* Hero */}
      <main className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-2xl text-center space-y-8">
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-balance">
            Instantly surface ESLint issues in any GitHub repo
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground">
            Paste a repository URL below and let CodeSynth reveal formatting errors, unused vars and more.
          </p>

          <div className="mx-auto max-w-xl">
            <RepoAnalyzer onAnalyze={handleAnalyze} compact />
          </div>
        </div>
      </main>

      <footer className="text-center text-xs text-muted-foreground py-6">
        © {new Date().getFullYear()} CodeSynth ·
        <a href="https://github.com" target="_blank" rel="noreferrer" className="ml-1 underline">
          GitHub
        </a>
      </footer>
    </div>
  );
}
