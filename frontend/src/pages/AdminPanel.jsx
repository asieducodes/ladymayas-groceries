// src/pages/AdminPanel.jsx
import { useState, useCallback, useEffect } from "react";
import Badge         from "../components/Badge";
import Toast         from "../components/Toast";
import ImageUploader from "../components/ImageUploader";
import { BRAND, currency } from "../constants/brand";
import {
  adminFetchAll, createProduct, updateProduct,
  deleteProduct, toggleStock, toggleVisibility,
} from "../services/api";
import { useToast } from "../hooks/useToast";

const EMPTY = {
  name: "", category: "", price: "", emoji: "🛒",
  image_url: "", purchase_type: ["retail"],
  in_stock: true, is_visible: true, description: "",
};

export default function AdminPanel({ onLogout }) {
  const [products, setProducts] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing,  setEditing]  = useState(null);
  const [form,     setForm]     = useState({ ...EMPTY });
  const { toast, showToast }    = useToast();

  const load = useCallback(async () => {
    try {
      setProducts(await adminFetchAll());
    } catch (e) {
      showToast(e.message, "error");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  // call load asynchronously to avoid synchronous setState within effect
  useEffect(() => { const t = setTimeout(() => { load(); }, 0); return () => clearTimeout(t); }, [load]);

  const openAdd  = () => { setForm({ ...EMPTY }); setEditing(null); setShowForm(true); };
  const openEdit = (p) => { setForm({ ...p, price: String(p.price) }); setEditing(p.id); setShowForm(true); };

  async function handleSave() {
    if (!form.name || !form.price) return showToast("Name and price required.", "error");
    try {
      const payload = { ...form, price: Number(form.price) };
      editing ? await updateProduct(editing, payload) : await createProduct(payload);
      showToast(editing ? "Product updated." : "Product added.");
      setShowForm(false);
      load();
    } catch (e) { showToast(e.message, "error"); }
  }

  async function handleDelete(id) {
    if (!confirm("Delete this product?")) return;
    try { await deleteProduct(id); showToast("Deleted."); load(); }
    catch (e) { showToast(e.message, "error"); }
  }

  const handleToggleStock = async (id) => {
    try { await toggleStock(id); load(); }
    catch (e) { showToast(e.message, "error"); }
  };

  const handleToggleVis = async (id) => {
    try { await toggleVisibility(id); load(); }
    catch (e) { showToast(e.message, "error"); }
  };

  const toggleType = (t) => setForm((prev) => ({
    ...prev,
    purchase_type: prev.purchase_type.includes(t)
      ? prev.purchase_type.filter((x) => x !== t)
      : [...prev.purchase_type, t],
  }));

  return (
    <div className="min-h-screen" style={{ background: "#F7F8FA" }}>
      <Toast {...toast} />

      {/* Header */}
      <header className="text-white px-6 py-4 flex items-center justify-between shadow-md" style={{ background: BRAND.green }}>
        <div className="flex items-center gap-3">
          <span className="text-2xl">🛒</span>
          <div>
            <h1 className="font-extrabold text-lg leading-none">Lady MaYa's</h1>
            <p className="text-xs opacity-70">Admin Dashboard</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={onLogout} className="text-sm opacity-70 hover:opacity-100">← Store</button>
          <button onClick={openAdd} className="px-4 py-2 rounded-xl text-sm font-bold" style={{ background: BRAND.orange, color: BRAND.dark }}>
            + Add Product
          </button>
        </div>
      </header>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 p-6 max-w-7xl mx-auto">
        {[
          { label: "Total",        val: products.length,                          icon: "📦" },
          { label: "In Stock",     val: products.filter((p) => p.in_stock).length, icon: "✅" },
          { label: "Out of Stock", val: products.filter((p) => !p.in_stock).length, icon: "⚠️" },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-2xl p-4 shadow-sm text-center">
            <div className="text-2xl mb-1">{s.icon}</div>
            <div className="text-2xl font-extrabold" style={{ color: BRAND.green }}>{s.val}</div>
            <div className="text-xs text-gray-400">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="px-6 pb-10 max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          {loading ? (
            <div className="py-16 text-center text-gray-400">Loading…</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b" style={{ background: BRAND.cream }}>
                    {["Product", "Category", "Price", "Type", "Stock", "Visible", "Actions"].map((h) => (
                      <th key={h} className="text-left px-4 py-3 font-semibold text-gray-600">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {products.map((p, i) => (
                    <tr key={p.id} className={`border-b hover:bg-gray-50 ${i % 2 ? "bg-gray-50/30" : ""}`}>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          {p.image_url
                            ? <img src={p.image_url} className="w-8 h-8 rounded-lg object-cover" alt="" />
                            : <span className="text-xl">{p.emoji}</span>
                          }
                          <span className="font-medium text-gray-800">{p.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-500">{p.category}</td>
                      <td className="px-4 py-3 font-bold" style={{ color: BRAND.green }}>{currency(p.price)}</td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1">
                          {p.purchase_type?.map((t) => <Badge key={t} color={t === "bulk" ? "green" : "amber"}>{t}</Badge>)}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <button onClick={() => handleToggleStock(p.id)}
                          className={`text-xs px-2 py-1 rounded-full font-semibold ${p.in_stock ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>
                          {p.in_stock ? "In Stock" : "Out"}
                        </button>
                      </td>
                      <td className="px-4 py-3">
                        <button onClick={() => handleToggleVis(p.id)}
                          className={`text-xs px-2 py-1 rounded-full font-semibold ${p.is_visible ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-500"}`}>
                          {p.is_visible ? "Shown" : "Hidden"}
                        </button>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <button onClick={() => openEdit(p)} className="text-xs px-3 py-1 rounded-lg border border-gray-200 hover:bg-gray-100">Edit</button>
                          <button onClick={() => handleDelete(p.id)} className="text-xs px-3 py-1 rounded-lg bg-red-50 text-red-500 hover:bg-red-100">Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Add / Edit modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-bold mb-4" style={{ color: BRAND.green }}>
              {editing ? "Edit Product" : "Add Product"}
            </h2>
            <div className="space-y-3">
              <ImageUploader currentUrl={form.image_url} onUploaded={(url) => setForm((f) => ({ ...f, image_url: url }))} />

              <Field label="Product Name *">
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Mama's Choice Rice 25kg" className="input" />
              </Field>

              <div className="grid grid-cols-2 gap-3">
                <Field label="Price (GH₵) *">
                  <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="input" />
                </Field>
                <Field label="Emoji (fallback)">
                  <input value={form.emoji} onChange={(e) => setForm({ ...form, emoji: e.target.value })} className="input" />
                </Field>
              </div>

              <Field label="Category">
                <input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="e.g. Beverages" className="input" />
              </Field>

              <Field label="Description">
                <textarea rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="input resize-none" />
              </Field>

              <Field label="Purchase Type">
                <div className="flex gap-2">
                  {["retail", "bulk"].map((t) => (
                    <button key={t} onClick={() => toggleType(t)}
                      className={`flex-1 py-2 rounded-xl text-sm font-semibold border transition-colors ${form.purchase_type.includes(t) ? "text-white border-transparent" : "text-gray-400 border-gray-200"}`}
                      style={form.purchase_type.includes(t) ? { background: t === "bulk" ? BRAND.green : BRAND.orange, color: t === "retail" ? BRAND.dark : undefined } : {}}>
                      {t === "retail" ? "🏪 Retail" : "📦 Bulk"}
                    </button>
                  ))}
                </div>
              </Field>

              <div className="flex gap-4">
                <Checkbox label="In Stock"         checked={form.in_stock}    onChange={(v) => setForm({ ...form, in_stock: v })} />
                <Checkbox label="Visible on Store" checked={form.is_visible}  onChange={(v) => setForm({ ...form, is_visible: v })} />
              </div>
            </div>

            <div className="flex gap-2 mt-5">
              <button onClick={handleSave} className="flex-1 py-3 rounded-xl text-white font-bold text-sm" style={{ background: BRAND.green }}>
                {editing ? "Save Changes" : "Add Product"}
              </button>
              <button onClick={() => setShowForm(false)} className="flex-1 py-3 rounded-xl text-sm font-semibold border border-gray-200 text-gray-500">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <label className="text-xs font-semibold text-gray-500 block mb-1">{label}</label>
      {children}
    </div>
  );
}

function Checkbox({ label, checked, onChange }) {
  return (
    <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="w-4 h-4 accent-green-700" />
      {label}
    </label>
  );
}