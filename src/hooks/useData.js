import { useEffect, useState } from "react";

export function useData(userId) {
  const [meals, setMeals] = useState([]);     // always arrays
  const [pantry, setPantry] = useState([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      const [mRes, pRes] = await Promise.all([
        fetch(`/api/meals?userId=${userId}`),
        fetch(`/api/ingredients?userId=${userId}`)
      ]);

      if (mRes.ok) {
        const m = await mRes.json();
        setMeals(Array.isArray(m) ? m : []);
      } else {
        console.error("Meals GET failed:", await mRes.text());
        setMeals([]);
      }

      if (pRes.ok) {
        const p = await pRes.json();
        setPantry(Array.isArray(p) ? p : []);
      } else {
        console.error("Ingredients GET failed:", await pRes.text());
        setPantry([]);
      }
    } catch (e) {
      console.error("Load error:", e);
      setMeals([]);
      setPantry([]);
    } finally {
      setLoading(false);
    }
  }

  // create
  async function addMeal(payload) {
    try {
      const res = await fetch("/api/meals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (!res.ok) {
        console.error("Add meal failed:", await res.text());
        return;
      }
      const created = await res.json();
      setMeals(m => [created, ...(Array.isArray(m) ? m : [])]);
    } catch (e) {
      console.error("Add meal error:", e);
    }
  }

  // delete
  async function deleteMeal(id) {
    try {
      const res = await fetch(`/api/meals?id=${id}`, { method: "DELETE" });
      if (!res.ok) {
        console.error("Delete meal failed:", await res.text());
        return;
      }
      setMeals(ms => (Array.isArray(ms) ? ms.filter(m => m._id !== id) : []));
    } catch (e) {
      console.error("Delete meal error:", e);
    }
  }

  // pantry helpers
  async function ensurePantryItem(name, inPantry) {
    const existing = (Array.isArray(pantry) ? pantry : []).find(
      p => p?.name?.toLowerCase() === String(name || "").toLowerCase()
    );
    if (existing) return existing;

    const res = await fetch("/api/ingredients", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, name, inPantry })
    });
    if (!res.ok) {
      console.error("Create pantry item failed:", await res.text());
      return null;
    }
    const created = await res.json();
    setPantry(xs => [...(Array.isArray(xs) ? xs : []), created]);
    return created;
  }

  async function togglePantry(id, inPantry) {
    const res = await fetch("/api/ingredients", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, inPantry })
    });
    if (!res.ok) {
      console.error("Toggle pantry failed:", await res.text());
      return;
    }
    const updated = await res.json();
    setPantry(xs => (Array.isArray(xs) ? xs.map(x => (x._id === id ? updated : x)) : []));
  }

  useEffect(() => { load(); }, [userId]);

  return { meals, pantry, loading, addMeal, deleteMeal, ensurePantryItem, togglePantry };
}
