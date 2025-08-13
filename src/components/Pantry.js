export default function Pantry({ items = [], onToggle }) {
  const haveItems = items.filter((it) => !!it.inPantry);

  return (
    <div className="border p-3">
      <h3 className="font-bold mb-2">Pantry</h3>
      <ul>
        {haveItems.map((it) => (
          <li key={it._id || it.name} className="mb-1">
            <span>{it.name}</span>
            <label className="ml-2 inline-flex items-center gap-1">
              <input
                type="checkbox"
                checked={true}                 // only showing 'have' items
                onChange={() => onToggle?.(it._id, false)} // uncheck -> leave pantry
              />
              <span>have</span>
            </label>
          </li>
        ))}
        {haveItems.length === 0 && (
          <li className="text-sm text-gray-500">No items in pantry.</li>
        )}
      </ul>
    </div>
  );
}
