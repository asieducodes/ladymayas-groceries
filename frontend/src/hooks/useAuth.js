// src/hooks/useAuth.js
import { useState } from "react";
import { login as apiLogin, clearToken, getToken } from "../services/api";

export function useAuth() {
  const [authed, setAuthed] = useState(!!getToken());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function login(username, password) {
    setLoading(true);
    setError("");
    try {
      await apiLogin(username, password);
      setAuthed(true);
      return true;
    } catch (e) {
      setError(e.message);
      return false;
    } finally {
      setLoading(false);
    }
  }

  function logout() {
    clearToken();
    setAuthed(false);
  }

  return { authed, login, logout, loading, error };
}