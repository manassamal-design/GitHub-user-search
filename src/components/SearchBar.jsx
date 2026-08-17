export function SearchBar({ value, onChange }) {
  return (
    <div className="search-bar">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search GitHub users (e.g. torvalds)"
        aria-label="Search GitHub users"
        autoFocus
      />
    </div>
  )
}
