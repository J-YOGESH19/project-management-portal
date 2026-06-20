const SearchBar = ({ value, onChange }) => (
  <input type="text" className="pmp-control" placeholder="Search tasks..." value={value} onChange={(e) => onChange(e.target.value)} />
);

export default SearchBar;