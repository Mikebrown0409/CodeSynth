import { useState } from "react";
import { Routes, Route } from "react-router";
import { getUser } from "../../services/authService";
import LandingPage from "../LandingPage/LandingPage";
import PostListPage from "../PostListPage/PostListPage";
import NewPostPage from "../NewPostPage/NewPostPage";
import SignUpPage from "../SignUpPage/SignUpPage";
import LogInPage from "../LogInPage/LogInPage";
import NavBar from "../../components/NavBar/NavBar";
import Dashboard from "../Dashboard/Dashboard";

import "./App.css";

export default function App() {
  const [user, setUser] = useState(getUser());

  return (
    <main className="App">
      <section id="main-section">
        <NavBar user={user} setUser={setUser} />
        {user ? (
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/posts" element={<PostListPage />} />
            <Route path="/posts/new" element={<NewPostPage />} />
            <Route path="*" element={null} />
          </Routes>
        ) : (
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/signup" element={<SignUpPage setUser={setUser} />} />
            <Route path="/login" element={<LogInPage setUser={setUser} />} />
            <Route path="*" element={null} />
          </Routes>
        )}
      </section>
    </main>
  );
}
