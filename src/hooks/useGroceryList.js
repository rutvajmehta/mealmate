export function useGroceryList(meals, pantry) {
  const safeMeals = Array.isArray(meals) ? meals : [];
  const safePantry = Array.isArray(pantry) ? pantry : [];

  const have = new Set(
    safePantry.filter(p => p?.inPantry).map(p => String(p?.name || "").toLowerCase())
  );

  const all = [];
  for (const m of safeMeals) {
    for (const ing of (m?.ingredients || [])) {
      const n = String(ing || "").trim();
      if (n && !have.has(n.toLowerCase())) all.push(n);
    }
  }
  const counts = all.reduce((acc, n) => (acc[n] = (acc[n] || 0) + 1, acc), {});
  return Object.entries(counts).map(([name, qty]) => ({ name, qty }));
}
