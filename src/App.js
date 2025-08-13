import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import "./App.css";

/**
 * Container component (state lifted here)
 * - Fetches meals from backend
 * - Provides add/update/delete handlers
 * - Derives grocery list from meals (presentational components receive props)
 */
const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:4000";

export default function App() {
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  // initial load
  useEffect(() => {
    let mounted = true;
    axios
      .get(`${API_BASE}/meals`)
      .then((res) => {
        if (mounted) setMeals(res.data || []);
      })
      .catch((e) => setErr(e?.message || "Failed to load meals"))
      .finally(() => setLoading(false));
    return () => (mounted = false);
  }, []);

  // handlers passed to presenters
  const addMeal = async (form) => {
    setErr("");
    const payload = normalizeMealForm(form);
    try {
      const { data } = await axios.post(`${API_BASE}/meals`, payload);
      setMeals((m) => [...m, data]);
    } catch (e) {
      setErr(e?.response?.data?.message || "Failed to add meal");
    }
  };

  const updateMeal = async (id, next) => {
    setErr("");
    try {
      const { data } = await axios.put(`${API_BASE}/meals/${id}`, next);
      setMeals((m) => m.map((it) => (it._id === id ? data : it)));
    } catch (e) {
      setErr(e?.response?.data?.message || "Failed to update meal");
    }
  };

  const deleteMeal = async (id) => {
    setErr("");
    try {
      await axios.delete(`${API_BASE}/meals/${id}`);
      setMeals((m) => m.filter((it) => it._id !== id));
    } catch (e) {
      setErr(e?.response?.data?.message || "Failed to delete meal");
    }
  };

  // derived data: grocery list (flatten + group)
  const groceryList = useMemo(() => {
    const map = new Map(); // key: name -> { name, quantity }
    for (const meal of meals) {
      for (const ing of meal?.ingredients || []) {
        if (ing.pantry) continue; // skip pantry items
        const key = ing.name.trim().toLowerCase();
        const prev = map.get(key);
        map.set(key, {
          name: ing.name.trim(),
          quantity: prev ? `${prev.quantity} + ${ing.quantity}` : ing.quantity || "",
        });
      }
    }
    return Array.from(map.values());
  }, [meals]);

  return (
    <div className="app">
      <Header />
      {err && <div className="error">{err}</div>}
      {loading ? (
        <div className="loading">Loading…</div>
      ) : (
        <>
          <MealPlanner
            meals={meals}
            onAdd={addMeal}
            onDelete={deleteMeal}
            onTogglePantry={(mealId, idx) => {
              const meal = meals.find((m) => m._id === mealId);
              if (!meal) return;
              const next = { ...meal, ingredients: [...meal.ingredients] };
              next.ingredients[idx] = {
                ...next.ingredients[idx],
                pantry: !next.ingredients[idx].pantry,
              };
              updateMeal(mealId, next);
            }}
          />
          <GroceryList items={groceryList} />
        </>
      )}
      <Footer />
    </div>
  );
}

/* -------------------- Presenters -------------------- */

function Header() {
  return (
    <header className="header">
      <h1>MealMate</h1>
      <p className="subtitle">Plan your week. Shop smarter.</p>
    </header>
  );
}

function Footer() {
  return <footer className="footer">© {new Date().getFullYear()} MealMate</footer>;
}

function MealPlanner({ meals, onAdd, onDelete, onTogglePantry }) {
  return (
    <section className="card">
      <h2>Weekly Meal Planner</h2>
      <AddMealForm onAdd={onAdd} />
      <ul className="meal-list">
        {meals.map((m) => (
          <li key={m._id} className="meal-item">
            <div className="meal-head">
              <strong>{m.day}</strong> — {m.name}
              <button className="danger" onClick={() => onDelete(m._id)}>Delete</button>
            </div>
            <ul className="ing-list">
              {(m.ingredients || []).map((ing, idx) => (
                <li key={idx} className="ing-item">
                  <label>
                    <input
                      type="checkbox"
                      checked={!!ing.pantry}
                      onChange={() => onTogglePantry(m._id, idx)}
                    />
                    <span className={ing.pantry ? "muted" : ""}>
                      {ing.name} {ing.quantity ? `— ${ing.quantity}` : ""}
                    </span>
                  </label>
                </li>
              ))}
            </ul>
          </li>
        ))}
        {meals.length === 0 && <li className="muted">No meals yet.</li>}
      </ul>
    </section>
  );
}

function GroceryList({ items }) {
  return (
    <section className="card">
      <h2>Grocery List</h2>
      <ul className="grocery-list">
        {items.map((it, i) => (
          <li key={i}>
            {it.name} {it.quantity ? `— ${it.quantity}` : ""}
          </li>
        ))}
        {items.length === 0 && <li className="muted">All set! Nothing to buy.</li>}
      </ul>
    </section>
  );
}

function AddMealForm({ onAdd }) {
  const [form, setForm] = useState({ name: "", day: "Monday", ingredients: "" });

  const submit = (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    onAdd(form);
    setForm({ name: "", day: "Monday", ingredients: "" });
  };

  return (
    <form className="add-form" onSubmit={submit}>
      <input
        placeholder="Meal name (e.g., Pasta with Pesto)"
        value={form.name}
        onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
      />
      <select
        value={form.day}
        onChange={(e) => setForm((f) => ({ ...f, day: e.target.value }))}
      >
        {["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"].map((d) => (
          <option key={d} value={d}>{d}</option>
        ))}
      </select>
      <input
        placeholder="Ingredients (comma separated, e.g., basil:1c, pasta:1lb)"
        value={form.ingredients}
        onChange={(e) => setForm((f) => ({ ...f, ingredients: e.target.value }))}
      />
      <button type="submit">Add</button>
    </form>
  );
}

/* -------------------- helpers -------------------- */
function normalizeMealForm(form) {
  // "basil:1c, pasta:1lb" -> [{name:'basil',quantity:'1c',pantry:false}, ...]
  const ingredients = (form.ingredients || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .map((pair) => {
      const [name, qty] = pair.split(":");
      return { name: (name || "").trim(), quantity: (qty || "").trim(), pantry: false };
    });
  return { name: form.name.trim(), day: form.day, ingredients };
}
