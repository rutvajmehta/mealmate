// import "../styles.css";
import Navbar from "../components/Header";
import MealPlanner from "../components/MealPlanner";
import GroceryList from "../components/GroceryList";
import Pantry from "../components/Pantry";
import WeeklyUsageChart from "../charts/WeeklyUsageChart";
import { useData } from "../hooks/useData";
import { useGroceryList } from "../hooks/useGroceryList";

const USER_ID = "000000000000000000000001"; // fixed MVP user

function groupMealsByDay(meals) {
  const byDay = {};
  for (let i = 0; i < meals.length; i++) {
    const m = meals[i];
    const d = m && m.day ? m.day : "";
    if (!d) continue;
    if (!byDay[d]) byDay[d] = [];
    byDay[d].push(m);
  }
  return byDay;
}

export default function Home() {
  const { meals, pantry, loading, addMeal, deleteMeal, ensurePantryItem, togglePantry } =
    useData(USER_ID);

  const grocery = useGroceryList(meals, pantry);
  const mealsByDay = groupMealsByDay(meals);

  async function toggleHaveFromGrocery(name, have) {
    const item = await ensurePantryItem(name, have);
    if (item && item._id) {
      await togglePantry(item._id, have);
    }
  }

  return (
    <div>
      <Navbar />
      <main className="p-4 space-y-4">
        <MealPlanner
          mealsByDay={mealsByDay}
          onAdd={(payload) => addMeal({ userId: USER_ID, ...payload })}
          onDelete={deleteMeal}
          loading={loading}
        />

        <div className="grid grid-cols-2 gap-2">
          <GroceryList items={grocery} onToggleHave={toggleHaveFromGrocery} />
          <Pantry items={pantry} onToggle={togglePantry} />
        </div>

        <WeeklyUsageChart meals={meals} />
      </main>
    </div>
  );
}
