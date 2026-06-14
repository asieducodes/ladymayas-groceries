// src/App.jsx
import { useState } from "react";
import StoreFront  from "./pages/StoreFront";
import AdminLogin  from "./pages/AdminLogin";
import AdminPanel  from "./pages/AdminPanel";
import { useAuth } from "./hooks/useAuth";

export default function App() {
  const [view, setView]     = useState("store");
  const { authed, login, logout } = useAuth();

  function goAdmin() {
    setView(authed ? "admin" : "adminLogin");
  }

  async function handleLogin(username, password) {
    const ok = await login(username, password);
    if (ok) setView("admin");
    return ok;
  }

  function handleLogout() {
    logout();
    setView("store");
  }

  if (view === "adminLogin") return <AdminLogin onLogin={handleLogin} />;
  if (view === "admin")      return <AdminPanel onLogout={handleLogout} />;
  return <StoreFront onAdminClick={goAdmin} />;
}