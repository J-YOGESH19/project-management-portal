const FilterDropdown = ({ value, onChange }) => (
  <select className="pmp-control" value={value} onChange={(e) => onChange(e.target.value)}>
    <option value="All">All Status</option>
    <option value="Pending">Pending</option>
    <option value="In Progress">In Progress</option>
    <option value="Completed">Completed</option>
  </select>
);

export default FilterDropdown;