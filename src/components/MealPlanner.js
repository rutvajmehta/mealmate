import DayColumn from "./DayColumn";
const DAYS = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];

export default function MealPlanner({ mealsByDay, onAdd, onDelete, loading }) {
  function submit(e) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const name = fd.get("name");
    const day = fd.get("day");
    const ingredients = String(fd.get("ingredients") || "")
      .split(",").map(s => s.trim()).filter(Boolean);
    onAdd?.({ name, day, ingredients });
    e.currentTarget.reset();
  }

  return (
    <section className="space-y-4">
      <form onSubmit={submit} className="flex flex-wrap items-end gap-2">
        <div>
          <label className="block text-sm">Meal</label>
          <input name="name" className="border rounded px-2 py-1" required />
        </div>
        <div>
          <label className="block text-sm">Ingredients (comma)</label>
          <input name="ingredients" className="border rounded px-2 py-1" />
        </div>
        <div>
          <label className="block text-sm">Day</label>
          <select name="day" className="border rounded px-2 py-1" required>
            {DAYS.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>
        <button className="bg-slate-900 text-white px-3 py-1 rounded">Add</button>
      </form>

      {loading ? <div>Loading planner…</div> : (
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-7 gap-3">
          {DAYS.map(d => (
            <DayColumn
              key={d}
              day={d}
              meals={mealsByDay[d] || []}
              onDeleteMeal={onDelete}
            />
          ))}
        </div>
      )}
    </section>
  );
}
