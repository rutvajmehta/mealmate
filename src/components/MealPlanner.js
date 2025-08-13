import DayColumn from "./DayColumn";

const DAYS = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];

export default function MealPlanner({ mealsByDay, onAdd, onDelete, loading }) {
  function submit(e) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const name = fd.get("name");
    const day = fd.get("day");
    const ingredients = String(fd.get("ingredients") || "")
      .split(",")
      .map(s => s.trim())
      .filter(Boolean);
    onAdd?.({ name, day, ingredients });
    e.currentTarget.reset();
  }

  return (
    <section>
      <form onSubmit={submit} className="mb-4 flex flex-wrap gap-2">
        <div>
          <label>Meal</label>
          <input name="name" className="border p-1" required />
        </div>
        <div>
          <label>Ingredients (comma)</label>
          <input name="ingredients" className="border p-1" />
        </div>
        <div>
          <label>Day</label>
          <select name="day" className="border p-1" required>
            {DAYS.map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>
        <button className="border px-3 py-1">Add</button>
      </form>

      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="grid grid-cols-7 gap-2">
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
