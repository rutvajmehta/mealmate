export default function MealCard({ meal, onDelete }) {
  return (
    <div className="border p-2 mb-2">
      <div>
        <div className="font-bold">{meal.name}</div>
        <div>{(meal.ingredients || []).join(", ")}</div>
      </div>
      <button
        className="text-red-600 text-sm"
        onClick={() => onDelete?.(meal._id)}
      >
        Delete
      </button>
    </div>
  );
}
