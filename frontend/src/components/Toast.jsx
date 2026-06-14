// src/components/Toast.jsx
export default function Toast({ msg, type }) {
  if (!msg) return null;
  const bg = type === "error" ? "bg-red-500" : "bg-green-700";
  return (
    <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] px-5 py-3 rounded-2xl text-white text-sm font-semibold shadow-xl ${bg}`}>
      {msg}
    </div>
  );
}