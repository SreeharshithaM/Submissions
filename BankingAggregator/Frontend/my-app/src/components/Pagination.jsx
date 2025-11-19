import React from 'react';

const Pagination = ({ page, pageSize, total, onChange }) => {
  const totalPages = Math.ceil(total / pageSize);

  if (totalPages <= 1) return null;

  return (
    <nav>
      <ul className="pagination justify-content-center">
        <li className={`page-item ${page === 1 ? 'disabled' : ''}`}>
          <button className="page-link" onClick={() => onChange(page - 1)}>
            Previous
          </button>
        </li>
        
        {[...Array(totalPages)].map((_, index) => (
          <li key={index + 1} className={`page-item ${page === index + 1 ? 'active' : ''}`}>
            <button className="page-link" onClick={() => onChange(index + 1)}>
              {index + 1}
            </button>
          </li>
        ))}
        
        <li className={`page-item ${page === totalPages ? 'disabled' : ''}`}>
          <button className="page-link" onClick={() => onChange(page + 1)}>
            Next
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Pagination;