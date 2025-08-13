export function useGroceryList(meals, pantry) {
  meals = meals || [];
  pantry = pantry || [];

  const have = [];
  for (let i = 0; i < pantry.length; i++) {
    const p = pantry[i];
    if (p && p.inPantry && p.name) {
      have.push(String(p.name).toLowerCase());
    }
  }

  const counts = {};
  for (let i = 0; i < meals.length; i++) {
    const m = meals[i];
    const ings = (m && m.ingredients) ? m.ingredients : [];
    for (let j = 0; j < ings.length; j++) {
      const raw = ings[j];
      const n = String(raw || "").trim();
      if (!n) continue;
      if (have.indexOf(n.toLowerCase()) !== -1) continue;
      counts[n] = (counts[n] || 0) + 1;
    }
  }

  const result = [];
  for (const name in counts) {
    result.push({ name, qty: counts[name] });
  }
  return result;
}
