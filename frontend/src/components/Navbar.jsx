// src/components/Navbar.jsx
import { BRAND } from "../constants/brand";

export default function Navbar({ search, onSearch, onMenuOpen, onAdminClick, totalBulk, totalRetail }) {
  return (
    <header className="sticky top-0 z-10 shadow-md" style={{ background: BRAND.green }}>
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-3">

        {/* Hamburger — mobile only */}
        <button
          onClick={onMenuOpen}
          className="lg:hidden text-white text-2xl leading-none mr-1"
          aria-label="Open filters"
        >
          ☰
        </button>

        {/* Logo */}
        <div className="flex items-center gap-2 mr-4 shrink-0">
          <span className="text-2xl">🛒</span>
          <div className="hidden sm:block">
            <p className="text-white font-extrabold text-base leading-none">Lady MaYa's</p>
            <p className="text-xs font-semibold leading-none" style={{ color: BRAND.orange }}>
              Groceries · Everything UK
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="flex-1 relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50 text-sm">🔍</span>
          <input
            value={search}
            onChange={(e) => onSearch(e.target.value)}
            placeholder="Search products…"
            className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm outline-none bg-white/10 text-white placeholder-white/50 border border-white/20 focus:bg-white/20 transition-colors"
          />
        </div>

        {/* Contact buttons */}
        <div className="hidden md:flex gap-2 ml-2 shrink-0">
          <a
            href="https://wa.me/447442847723"
            target="_blank" rel="noreferrer"
            className="px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap"
            style={{ background: BRAND.orange, color: BRAND.dark }}
          >
             UK
          </a>
          <a
            href="https://wa.me/233263262569"
            target="_blank" rel="noreferrer"
            className="px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap bg-white/10 text-white border border-white/20"
          >
             Ghana
          </a>
        </div>

        <button
          onClick={onAdminClick}
          className="hidden sm:block text-xs text-white/40 hover:text-white/80 ml-1 transition-colors"
        >
          Admin
        </button>
      </div>

      {/* Sub-bar */}
      <div className="max-w-7xl mx-auto px-4 pb-3 flex items-center justify-between">
        <p className="text-white/80 text-xs">
          🇬🇧 Authentic UK groceries — retail &amp; bulk.
        </p>
        <div className="flex gap-4 text-white/50 text-xs">
          <span>📦 {totalBulk} bulk</span>
          <span>🏪 {totalRetail} retail</span>
        </div>
      </div>
    </header>
  );
}