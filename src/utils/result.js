export const isTumor = (p) => {
  if (typeof p.tumor_detected === "boolean") return p.tumor_detected;
  const label = String(p.prediction ?? "").toLowerCase().replace(/[\s_-]/g, "");
  return label !== "notumor" && label !== "";
};

// Backend may send 0.97 or 97 — always return a percentage number
export const confidencePct = (c) => {
  const n = Number(c);
  if (Number.isNaN(n)) return 0;
  return n <= 1 ? n * 100 : n;
};
