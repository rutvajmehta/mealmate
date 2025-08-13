export default function GroceryList({ items, onToggleHave }) {
  return (
    <div className="border p-3">
      <h3 className="font-bold mb-2">Grocery List</h3>
      <ul>
        {items.map((it, i) => (
          <li key={i} className="mb-1">
            <input
              type="checkbox"
              onChange={(e) => onToggleHave?.(it.name, e.target.checked)}
            />{" "}
            {it.name} (x{it.qty})
          </li>
        ))}
      </ul>
    </div>
  );
}
