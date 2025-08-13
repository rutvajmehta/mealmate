// import "../styles.css";
import Navbar from "../components/Header";
import MealPlanner from "../components/MealPlanner";
import GroceryList from "../components/GroceryList";
import Pantry from "../components/Pantry";
import WeeklyUsageChart from "../charts/WeeklyUsageChart";
import { useData } from "../hooks/useData";
import { useGroceryList } from "../hooks/useGroceryList";
import { useMemo } from "react";

const USER_ID = "000000000000000000000001"; // fixed MVP user

export default function Home() {
  const { meals, pantry, loading, addMeal, deleteMeal, ensurePantryItem, togglePantry } = useData(USER_ID);
  const grocery = useGroceryList(meals, pantry);
  const mealsByDay = useMemo(() => meals.reduce((a, m) => ((a[m.day] ||= []).push(m), a), {}), [meals]);

  async function toggleHaveFromGrocery(name, have) {
    const item = await ensurePantryItem(name, have);
    if (item && item._id) await togglePantry(item._id, have);
  }

  return (
    <div>
      <Navbar />
      <main className="max-w-5xl mx-auto px-4 py-6 space-y-6">
        <MealPlanner
          mealsByDay={mealsByDay}
          onAdd={(payload) => addMeal({ userId: USER_ID, ...payload })}
          onDelete={deleteMeal}
          loading={loading}
        />
        <div className="grid grid-cols-2 gap-4">
          <GroceryList items={grocery} onToggleHave={toggleHaveFromGrocery} />
          <Pantry items={pantry} onToggle={togglePantry} />
        </div>
        <WeeklyUsageChart meals={meals} />
      </main>
    </div>
  );
}
