const Pagination = ({ page, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <nav className="pmp-pagination">
      <button className="pmp-page-btn" disabled={page === 1} onClick={() => onPageChange(page - 1)}>Prev</button>
      {pages.map((p) => (
        <button key={p} className={`pmp-page-btn ${p === page ? "active" : ""}`} onClick={() => onPageChange(p)}>{p}</button>
      ))}
      <button className="pmp-page-btn" disabled={page === totalPages} onClick={() => onPageChange(page + 1)}>Next</button>
    </nav>
  );
};

export default Pagination;