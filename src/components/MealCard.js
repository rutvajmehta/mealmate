export default function MealCard({ meal, onDelete }) {
  return (
    <div className="bg-white border rounded p-2 mb-2 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <div className="font-medium">{meal.name}</div>
          <div className="text-xs text-slate-500">{(meal.ingredients||[]).join(", ")}</div>
        </div>
        <button className="text-xs text-red-600" onClick={() => onDelete?.(meal._id)}>delete</button>
      </div>
    </div>
  );
}
