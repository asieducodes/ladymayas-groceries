// src/components/Badge.jsx
export default function Badge({ children, color = "green" }) {
  const styles = {
    green: "bg-green-100 text-green-800",
    amber: "bg-amber-100 text-amber-800",
    red:   "bg-red-100 text-red-600",
    blue:  "bg-blue-100 text-blue-700",
    gray:  "bg-gray-100 text-gray-600",
  };
  return (
    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${styles[color] || styles.green}`}>
      {children}
    </span>
  );
}