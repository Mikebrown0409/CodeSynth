import { Code2, Github, LogOut } from "lucide-react"
import { getUser, logOut } from "../../services/authService"
import { useNavigate } from "react-router"
import { buttonVariants } from "../ui/button"

export default function NavBar() {
  const navigate = useNavigate()
  const user = getUser()

  function handleLogOut() {
    logOut()
    navigate("/")
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex">
          <a className="mr-6 flex items-center space-x-2" href="/">
            <Code2 className="h-6 w-6" />
            <span className="hidden font-bold sm:inline-block">
              CodeSynth
            </span>
          </a>
        </div>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            <span className="text-sm text-muted-foreground">
              Analyze GitHub repositories for lint issues
            </span>
          </div>
          <nav className="flex items-center">
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 py-2 w-9 px-0"
            >
              <Github className="h-4 w-4" />
              <span className="sr-only">GitHub</span>
            </a>
            {user && (
              <button
                onClick={handleLogOut}
                className={buttonVariants({ variant: "ghost", size: "icon" })}
              >
                <LogOut className="h-4 w-4" />
                <span className="sr-only">Log out</span>
              </button>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
} 