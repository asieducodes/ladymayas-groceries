// src/services/api.js
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

// ── Token helpers ─────────────────────────────────────────────
export const saveToken  = (t) => localStorage.setItem("maya_token", t);
export const getToken   = ()  => localStorage.getItem("maya_token");
export const clearToken = ()  => localStorage.removeItem("maya_token");

const authHeaders = () => ({
  "Content-Type": "application/json",
  Authorization:  `Bearer ${getToken()}`,
});

// ── Auth ──────────────────────────────────────────────────────
export async function login(username, password) {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method:  "POST",
    headers: { "Content-Type": "application/json" },
    body:    JSON.stringify({ username, password }),
  });
  if (!res.ok) throw new Error("Wrong username or password.");
  const data = await res.json();
  saveToken(data.access_token);
  return data;
}

// ── Products (public) ─────────────────────────────────────────
export async function fetchProducts({ search = "", category = "", purchaseType = "" } = {}) {
  const params = new URLSearchParams();
  if (search)                          params.set("search", search);
  if (category && category !== "All")  params.set("category", category);
  if (purchaseType && purchaseType !== "All") params.set("purchase_type", purchaseType);

  const res = await fetch(`${BASE_URL}/products?${params}`);
  if (!res.ok) throw new Error("Failed to load products.");
  return res.json();
}

export async function fetchCategories() {
  const res = await fetch(`${BASE_URL}/products/categories`);
  if (!res.ok) throw new Error("Failed to load categories.");
  return res.json();
}

// ── Products (admin) ──────────────────────────────────────────
export async function adminFetchAll() {
  const res = await fetch(`${BASE_URL}/products/admin/all`, { headers: authHeaders() });
  if (res.status === 401) { clearToken(); throw new Error("Session expired."); }
  if (!res.ok) throw new Error("Failed to load products.");
  return res.json();
}

export async function createProduct(data) {
  const res = await fetch(`${BASE_URL}/products`, {
    method:  "POST",
    headers: authHeaders(),
    body:    JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create product.");
  return res.json();
}

export async function updateProduct(id, data) {
  const res = await fetch(`${BASE_URL}/products/${id}`, {
    method:  "PATCH",
    headers: authHeaders(),
    body:    JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update product.");
  return res.json();
}

export async function deleteProduct(id) {
  const res = await fetch(`${BASE_URL}/products/${id}`, {
    method:  "DELETE",
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error("Failed to delete product.");
}

export async function toggleStock(id) {
  const res = await fetch(`${BASE_URL}/products/${id}/toggle-stock`, {
    method: "PATCH", headers: authHeaders(),
  });
  if (!res.ok) throw new Error("Failed to toggle stock.");
  return res.json();
}

export async function toggleVisibility(id) {
  const res = await fetch(`${BASE_URL}/products/${id}/toggle-visibility`, {
    method: "PATCH", headers: authHeaders(),
  });
  if (!res.ok) throw new Error("Failed to toggle visibility.");
  return res.json();
}

// ── Image upload ──────────────────────────────────────────────
export async function uploadImage(file) {
  const formData = new FormData();
  formData.append("file", file);
  const res = await fetch(`${BASE_URL}/upload/image`, {
    method:  "POST",
    headers: { Authorization: `Bearer ${getToken()}` },
    body:    formData,
  });
  if (!res.ok) throw new Error("Image upload failed.");
  return res.json();
}