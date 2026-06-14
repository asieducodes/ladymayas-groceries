// src/pages/StoreFront.jsx
import { useState, useMemo } from "react";
import Navbar       from "../components/Navbar";
import Sidebar      from "../components/Sidebar";
import ProductCard  from "../components/ProductCard";
import ProductModal from "../components/ProductModal";
import { useProducts } from "../hooks/useProducts";
import { BRAND }    from "../constants/brand";

export default function StoreFront({ onAdminClick }) {
  const [search,       setSearch]       = useState("");
  const [category,     setCategory]     = useState("All");
  const [letter,       setLetter]       = useState("All");
  const [purchaseType, setPurchaseType] = useState("All");
  const [sidebarOpen,  setSidebarOpen]  = useState(false);
  const [selected,     setSelected]     = useState(null);

  const { products, categories, loading } = useProducts({ search, category, purchaseType });

  // A–Z is client-side (no extra round-trip)
  const filtered = useMemo(() =>
    letter === "All" ? products : products.filter((p) => p.name.toUpperCase().startsWith(letter)),
    [products, letter]
  );

  const activeFilters = [
    category !== "All"     && { label: category,     clear: () => setCategory("All") },
    letter !== "All"       && { label: `"${letter}"`, clear: () => setLetter("All") },
    purchaseType !== "All" && { label: purchaseType,  clear: () => setPurchaseType("All") },
  ].filter(Boolean);

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#F7F8FA" }}>
      <Navbar
        search={search}
        onSearch={setSearch}
        onMenuOpen={() => setSidebarOpen(true)}
        onAdminClick={onAdminClick}
        totalBulk={products.filter((p) => p.purchase_type?.includes("bulk")).length}
        totalRetail={products.filter((p) => p.purchase_type?.includes("retail")).length}
      />

      <div className="flex flex-1 max-w-7xl mx-auto w-full">
        <Sidebar
          categories={categories}
          category={category}     setCategory={setCategory}
          letter={letter}         setLetter={setLetter}
          purchaseType={purchaseType} setPurchaseType={setPurchaseType}
          isOpen={sidebarOpen}    onClose={() => setSidebarOpen(false)}
        />

        <main className="flex-1 p-4 lg:p-6 min-w-0">
          {/* Filter chips */}
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="text-sm text-gray-500">
              Showing <strong>{filtered.length}</strong> products
            </span>
            {activeFilters.map((f) => (
              <span key={f.label} className="flex items-center gap-1 text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                {f.label}
                <button onClick={f.clear} className="font-bold ml-1">✕</button>
              </span>
            ))}
            {activeFilters.length > 0 && (
              <button
                onClick={() => { setCategory("All"); setLetter("All"); setPurchaseType("All"); setSearch(""); }}
                className="text-xs text-red-400 hover:text-red-600"
              >
                Clear all
              </button>
            )}
          </div>

          {/* Grid */}
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl h-52 animate-pulse opacity-60" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-lg font-semibold text-gray-600">No products found</h3>
              <p className="text-gray-400 text-sm mt-1">Try adjusting your filters.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3 lg:gap-4">
              {filtered.map((p) => (
                <ProductCard key={p.id} product={p} onClick={setSelected} />
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Footer */}
      <footer className="text-white py-6 px-4 mt-4" style={{ background: BRAND.dark }}>
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm">
          <div>
            <p className="font-bold" style={{ color: BRAND.orange }}>Lady MaYa's Groceries</p>
            <p className="text-gray-400 text-xs">Everything UK — Retail &amp; Bulk</p>
          </div>
          <div className="flex gap-4 text-gray-400 text-xs">
            <a href="https://wa.me/447442847723" className="hover:text-white">📞 +44 7442 847723</a>
            <a href="https://wa.me/233263262569" className="hover:text-white">📞 +233 2632 62569</a>
          </div>
        </div>
      </footer>

      <ProductModal product={selected} onClose={() => setSelected(null)} />
    </div>
  );
}