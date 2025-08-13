export default function Pantry({ items, onToggle }) {
  return (
    <div className="border p-3">
      <h3 className="font-bold mb-2">Pantry</h3>
      <ul>
        {items.map(it => (
          <li key={it._id} className="mb-1">
            {it.name}
            <label className="ml-2">
              <input
                type="checkbox"
                checked={!!it.inPantry}
                onChange={e => onToggle?.(it._id, e.target.checked)}
              />{" "}
              have
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
}
