// src/hooks/useToast.js
import { useState, useCallback } from "react";

export function useToast() {
  const [toast, setToast] = useState({ msg: "", type: "ok" });

  const showToast = useCallback((msg, type = "ok") => {
    setToast({ msg, type });
    setTimeout(() => setToast({ msg: "", type: "ok" }), 3000);
  }, []);

  return { toast, showToast };
}