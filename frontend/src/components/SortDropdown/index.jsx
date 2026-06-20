const SortDropdown = ({ value, onChange }) => (
  <select className="pmp-control" value={value} onChange={(e) => onChange(e.target.value)}>
    <option value="newest">Newest First</option>
    <option value="oldest">Oldest First</option>
  </select>
);

export default SortDropdown;