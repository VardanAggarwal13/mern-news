export default function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null;

  const prev = () => onChange(Math.max(page - 1, 1));
  const next = () => onChange(Math.min(page + 1, totalPages));

  return (
    <div className="flex items-center justify-center gap-3 mt-6">
      <button
        onClick={prev}
        disabled={page === 1}
        className="px-3 py-1.5 text-sm rounded border border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        ← Prev
      </button>
      <span className="text-sm text-gray-600">
        Page <span className="font-medium">{page}</span> of {totalPages}
      </span>
      <button
        onClick={next}
        disabled={page === totalPages}
        className="px-3 py-1.5 text-sm rounded border border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Next →
      </button>
    </div>
  );
}
