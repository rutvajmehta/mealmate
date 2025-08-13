import { useEffect, useState } from "react";

export function useData(userId) {
  const [meals, setMeals] = useState([]);
  const [pantry, setPantry] = useState([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);

    // fetch meals
    const mRes = await fetch(`/api/meals?userId=${userId}`);
    const mData = await mRes.json();
    setMeals(mData);

    // fetch pantry
    const pRes = await fetch(`/api/ingredients?userId=${userId}`);
    const pData = await pRes.json();
    setPantry(pData);

    setLoading(false);
  }

  async function addMeal(payload) {
    const res = await fetch("/api/meals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const created = await res.json();
    setMeals(m => [created, ...m]);
  }

  async function deleteMeal(id) {
    await fetch(`/api/meals?id=${id}`, { method: "DELETE" });
    setMeals(ms => ms.filter(m => m._id !== id));
  }

  async function ensurePantryItem(name, inPantry) {
    const existing = pantry.find(p => p.name.toLowerCase() === name.toLowerCase());
    if (existing) return existing;

    const res = await fetch("/api/ingredients", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, name, inPantry })
    });
    const created = await res.json();
    setPantry(xs => [...xs, created]);
    return created;
  }

  async function togglePantry(id, inPantry) {
    const res = await fetch("/api/ingredients", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, inPantry })
    });
    const updated = await res.json();
    setPantry(xs => xs.map(x => (x._id === id ? updated : x)));
  }

  useEffect(() => { load(); }, [userId]);

  return { meals, pantry, loading, addMeal, deleteMeal, ensurePantryItem, togglePantry };
}
