import { Link } from "react-router";
import { Code2 } from "lucide-react";
import { buttonVariants } from "../ui/button";

export default function PublicHeader() {
  const apiBaseUrl = import.meta.env.DEV ? 'http://localhost:3000' : '';

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-bold">
          <Code2 className="h-6 w-6" />
          <span className="hidden sm:inline-block">CodeSynth</span>
        </Link>
        <div className="flex items-center gap-2">
          <a
            href={`${apiBaseUrl}/api/auth/github`}
            className={buttonVariants({ variant: "ghost", size: "sm" })}
          >
            Sign in with GitHub
          </a>
          <a
            href={`${apiBaseUrl}/api/auth/github`}
            className={buttonVariants({ size: "sm" })}
          >
            Get Started
          </a>
        </div>
      </div>
    </header>
  );
} 