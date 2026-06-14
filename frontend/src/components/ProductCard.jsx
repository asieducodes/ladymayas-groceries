// src/components/ProductCard.jsx
import Badge from "./Badge";
import { BRAND, currency } from "../constants/brand";

export default function ProductCard({ product, onClick }) {
  return (
    <div
      onClick={() => onClick(product)}
      className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-200 cursor-pointer overflow-hidden group relative"
    >
      {/* Image / emoji */}
      <div
        className="h-36 flex items-center justify-center overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${BRAND.cream}, #fff)` }}
      >
        {product.image_url
          ? <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
          : <span className="text-6xl">{product.emoji || "🛒"}</span>
        }
      </div>

      {/* Out of stock overlay */}
      {!product.in_stock && (
        <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
          <span className="text-xs font-bold text-red-500 bg-red-50 px-2 py-1 rounded-full">
            Out of Stock
          </span>
        </div>
      )}

      {/* Info */}
      <div className="p-3">
        <p className="text-xs text-gray-400 mb-0.5">{product.category}</p>
        <h3 className="font-semibold text-gray-800 text-sm leading-snug line-clamp-2 mb-2 group-hover:text-green-700 transition-colors">
          {product.name}
        </h3>
        <div className="flex items-center justify-between flex-wrap gap-1">
          <span className="font-bold text-base" style={{ color: BRAND.green }}>
            {currency(product.price)}
          </span>
          <div className="flex gap-1 flex-wrap">
            {product.purchase_type?.includes("bulk")   && <Badge color="green">Bulk</Badge>}
            {product.purchase_type?.includes("retail") && <Badge color="amber">Retail</Badge>}
          </div>
        </div>
      </div>
    </div>
  );
}