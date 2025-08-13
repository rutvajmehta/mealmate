export function useGroceryList(meals = [], pantry = []) {
  const counts = {};
  for (const m of meals) {
    const ings = m?.ingredients || [];
    for (const raw of ings) {
      const n = String(raw || "").trim();
      if (!n) continue;
      const key = n.toLowerCase();
      counts[key] = (counts[key] || 0) + 1;
    }
  }

  const haveSet = new Set(
    pantry
      .filter((p) => p?.name)
      .filter((p) => !!p.inPantry)
      .map((p) => p.name.toLowerCase())
  );

  const result = [];
  for (const [key, qty] of Object.entries(counts)) {
    if (!haveSet.has(key)) {
      result.push({ name: key, qty, have: false });
    }
  }

  result.sort((a, b) => a.name.localeCompare(b.name));
  return result;
}
