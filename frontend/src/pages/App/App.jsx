import { useState } from "react";
import { useEffect } from "react";
import { Routes, Route } from "react-router";
import { getUser } from "../../services/authService";
import LandingPage from "../LandingPage/LandingPage";
import Dashboard from "../Dashboard/Dashboard";

export default function App() {
  const [user, setUser] = useState(getUser());

  // Handle OAuth callback token
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    
    if (token) {
      // Store the token and update user state
      localStorage.setItem('token', token);
      setUser(getUser());
      
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {user ? (
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="*" element={<Dashboard />} />
        </Routes>
      ) : (
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="*" element={<LandingPage />} />
        </Routes>
      )}
    </div>
  );
}
