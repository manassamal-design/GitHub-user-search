export function Pagination({ page, totalPages, onPageChange, disabled }) {
  if (totalPages <= 1) return null

  return (
    <div className="pagination">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={disabled || page <= 1}
      >
        ← Prev
      </button>
      <span>
        Page {page} of {totalPages}
      </span>
      <button
        onClick={() => onPageChange(page + 1)}
        disabled={disabled || page >= totalPages}
      >
        Next →
      </button>
    </div>
  )
}
