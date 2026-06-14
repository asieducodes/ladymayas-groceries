// src/constants/brand.js
export const BRAND = {
  green:      "#1B4332",
  greenMid:   "#2D6A4F",
  greenLight: "#40916C",
  orange:     "#F4A228",
  cream:      "#FFF8EE",
  dark:       "#0D1F16",
};

export const ALPHABET = [
  "All",
  ..."ABCDEFGHIJKLMNOPQRSTUVWXYZ".split(""),
];

export const PURCHASE_TYPES = ["All", "retail", "bulk"];

export const currency = (n) => `GH₵ ${Number(n).toFixed(2)}`;