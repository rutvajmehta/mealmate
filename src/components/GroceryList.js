export default function GroceryList({ items, onToggleHave }) {
  return (
    <div className="border p-3">
      <h3 className="font-bold mb-2">Grocery List</h3>
      <ul>
        {items.map((it) => (
          <li key={it.name} className="mb-1">
            <label className="inline-flex items-center gap-2">
              <input
                type="checkbox"
                checked={false} // always unchecked because these are "need to buy"
                onChange={(e) => onToggleHave?.(it.name, e.target.checked)} // checked -> moves to Pantry
              />
              <span>
                {it.name} (x{it.qty})
              </span>
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
}
