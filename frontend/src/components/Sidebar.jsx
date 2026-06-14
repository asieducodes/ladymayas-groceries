// src/components/Sidebar.jsx
import { BRAND, ALPHABET, PURCHASE_TYPES } from "../constants/brand";

export default function Sidebar({
  categories,
  category, setCategory,
  letter,   setLetter,
  purchaseType, setPurchaseType,
  isOpen, onClose,
}) {
  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`
          fixed top-0 left-0 h-full z-30 w-64 flex-shrink-0 overflow-y-auto
          lg:static lg:z-auto lg:h-auto lg:block
          transform transition-transform duration-300
          ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
        style={{ background: BRAND.dark }}
      >
        <div className="p-5">

          {/* Mobile header */}
          <div className="flex items-center justify-between mb-6 lg:hidden">
            <span className="font-bold text-lg" style={{ color: BRAND.orange }}>Filters</span>
            <button onClick={onClose} className="text-gray-400 text-xl">✕</button>
          </div>

          {/* Purchase type */}
          <Section label="Purchase Type">
            {PURCHASE_TYPES.map((t) => (
              <SidebarButton
                key={t}
                active={purchaseType === t}
                onClick={() => setPurchaseType(t)}
              >
                {t === "All" ? "🛒 All" : t === "retail" ? "🏪 Retail" : "📦 Bulk"}
              </SidebarButton>
            ))}
          </Section>

          {/* Categories */}
          <Section label="Category">
            {["All", ...categories].map((cat) => (
              <SidebarButton
                key={cat}
                active={category === cat}
                onClick={() => setCategory(cat)}
              >
                {cat}
              </SidebarButton>
            ))}
          </Section>

          {/* A–Z */}
          <Section label="A–Z Browse">
            <div className="grid grid-cols-7 gap-1">
              {ALPHABET.map((l) => (
                <button
                  key={l}
                  onClick={() => setLetter(l)}
                  className="text-xs py-1 rounded font-mono font-semibold transition-colors"
                  style={
                    letter === l
                      ? { background: BRAND.orange, color: BRAND.dark }
                      : { color: "#888" }
                  }
                >
                  {l === "All" ? "✱" : l}
                </button>
              ))}
            </div>
          </Section>
        </div>
      </aside>
    </>
  );
}

function Section({ label, children }) {
  return (
    <div className="mb-6">
      <p
        className="text-xs font-bold uppercase tracking-widest mb-3"
        style={{ color: "#F4A228" }}
      >
        {label}
      </p>
      {children}
    </div>
  );
}

function SidebarButton({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`block w-full text-left px-3 py-2 rounded-lg text-sm mb-1 transition-colors ${
        active ? "text-white font-semibold" : "text-gray-400 hover:text-white"
      }`}
      style={active ? { background: "#2D6A4F" } : {}}
    >
      {children}
    </button>
  );
}