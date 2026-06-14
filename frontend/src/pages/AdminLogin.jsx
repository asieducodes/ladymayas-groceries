// src/pages/AdminLogin.jsx
import { useState } from "react";
import { BRAND } from "../constants/brand";

export default function AdminLogin({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState("");

  async function handleSubmit() {
    setLoading(true);
    setError("");
    const ok = await onLogin(username, password);
    if (!ok) setError("Wrong username or password.");
    setLoading(false);
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ background: BRAND.dark }}>
      <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-sm">
        <div className="text-center mb-6">
          <div className="text-4xl mb-2">🛒</div>
          <h1 className="text-xl font-extrabold" style={{ color: BRAND.green }}>Lady MaYa's Admin</h1>
          <p className="text-sm text-gray-400">Sign in to manage products</p>
        </div>

        {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}

        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm mb-3 outline-none focus:border-green-500"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm mb-4 outline-none focus:border-green-500"
        />
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full py-3 rounded-xl text-white font-bold text-sm disabled:opacity-60"
          style={{ background: BRAND.green }}
        >
          {loading ? "Signing in…" : "Sign In"}
        </button>
      </div>
    </div>
  );
}