export default function GroceryList({ items, onToggleHave }) {
  return (
    <div className="bg-white border rounded p-3">
      <h3 className="font-semibold mb-2">Grocery List</h3>
      <ul className="space-y-1">
        {items.map((it, i) => (
          <li key={i} className="flex items-center gap-2">
            <input
              type="checkbox"
              onChange={(e) => onToggleHave?.(it.name, e.target.checked)}
              title="Mark as already have"
            />
            <span className="text-sm">
              {it.name} <span className="text-xs text-slate-500">x{it.qty}</span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
