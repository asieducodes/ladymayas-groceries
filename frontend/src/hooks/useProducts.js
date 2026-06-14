// src/hooks/useProducts.js
import { useState, useEffect, useCallback } from "react";
import { fetchProducts, fetchCategories } from "../services/api";

export function useProducts({ search, category, purchaseType }) {
  const [products,   setProducts]   = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [prods, cats] = await Promise.all([
        fetchProducts({ search, category, purchaseType }),
        fetchCategories(),
      ]);
      setProducts(prods);
      setCategories(cats);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [search, category, purchaseType]);

  useEffect(() => {
    const timer = setTimeout(load, 300); // debounce search
    return () => clearTimeout(timer);
  }, [load]);

  return { products, categories, loading, error, reload: load };
}