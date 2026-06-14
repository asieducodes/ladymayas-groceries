// src/components/ProductModal.jsx
import Badge from "./Badge";
import { BRAND, currency } from "../constants/brand";

export default function ProductModal({ product, onClose }) {
  if (!product) return null;

  const waMsg = encodeURIComponent(`Hi, I'd like to order: ${product.name} — ${currency(product.price)}`);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.5)" }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl shadow-2xl max-w-sm w-full p-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Image */}
        <div
          className="h-48 rounded-2xl overflow-hidden mb-4 flex items-center justify-center"
          style={{ background: BRAND.cream }}
        >
          {product.image_url
            ? <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
            : <span className="text-7xl">{product.emoji || "🛒"}</span>
          }
        </div>

        {/* Badges */}
        <div className="flex gap-1 flex-wrap mb-2">
          {product.purchase_type?.includes("bulk")   && <Badge color="green">Bulk</Badge>}
          {product.purchase_type?.includes("retail") && <Badge color="amber">Retail</Badge>}
          {!product.in_stock && <Badge color="red">Out of Stock</Badge>}
        </div>

        <h2 className="text-xl font-bold text-gray-800 mt-1">{product.name}</h2>
        {product.description && (
          <p className="text-sm text-gray-500 mt-1 mb-3">{product.description}</p>
        )}
        <p className="text-2xl font-extrabold mb-4" style={{ color: BRAND.green }}>
          {currency(product.price)}
        </p>

        {/* WhatsApp CTAs — pre-filled message */}
        <div className="flex gap-2">
          <a
            href={`https://wa.me/447442847723?text=${waMsg}`}
            target="_blank" rel="noreferrer"
            className="flex-1 text-center py-3 rounded-xl text-white text-sm font-semibold"
            style={{ background: BRAND.green }}
          >
            📲 Order via UK
          </a>
          <a
            href={`https://wa.me/233263262569?text=${waMsg}`}
            target="_blank" rel="noreferrer"
            className="flex-1 text-center py-3 rounded-xl text-white text-sm font-semibold"
            style={{ background: BRAND.orange, color: BRAND.dark }}
          >
            📲 Order via Ghana
          </a>
        </div>

        <button
          onClick={onClose}
          className="w-full mt-3 py-2 text-sm text-gray-400 hover:text-gray-600"
        >
          Close
        </button>
      </div>
    </div>);
}