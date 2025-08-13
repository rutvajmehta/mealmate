export default function Pantry({ items, onToggle }) {
  return (
    <div className="bg-white border rounded p-3">
      <h3 className="font-semibold mb-2">Pantry</h3>
      <ul className="space-y-1">
        {items.map(it => (
          <li key={it._id} className="flex items-center justify-between">
            <span className="text-sm">{it.name}</span>
            <label className="text-xs">
              <input
                type="checkbox"
                checked={!!it.inPantry}
                onChange={e => onToggle?.(it._id, e.target.checked)}
                title="Already have"
              /> have
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
}
