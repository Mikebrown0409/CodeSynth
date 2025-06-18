import { useState } from "react";
import { Routes, Route } from "react-router";
import { getUser } from "../../services/authService";
import LandingPage from "../LandingPage/LandingPage";
import PostListPage from "../PostListPage/PostListPage";
import NewPostPage from "../NewPostPage/NewPostPage";
import SignUpPage from "../SignUpPage/SignUpPage";
import LogInPage from "../LogInPage/LogInPage";
import Dashboard from "../Dashboard/Dashboard";

export default function App() {
  const [user, setUser] = useState(getUser());

  return (
    <div className="min-h-screen bg-background text-foreground">
      {user ? (
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/posts" element={<PostListPage />} />
          <Route path="/posts/new" element={<NewPostPage />} />
          <Route path="*" element={<Dashboard />} />
        </Routes>
      ) : (
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/signup" element={<SignUpPage setUser={setUser} />} />
          <Route path="/login" element={<LogInPage setUser={setUser} />} />
          <Route path="*" element={<LandingPage />} />
        </Routes>
      )}
    </div>
  );
}
