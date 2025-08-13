import MealCard from "./MealCard";

export default function DayColumn({ day, meals, onDeleteMeal }) {
  return (
    <div className="bg-slate-100 rounded p-2 min-h-40">
      <div className="font-semibold mb-2">{day}</div>
      {meals.map(m => <MealCard key={m._id} meal={m} onDelete={onDeleteMeal} />)}
    </div>
  );
}
