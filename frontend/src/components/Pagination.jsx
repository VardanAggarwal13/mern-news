export default function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null;

  const prev = () => onChange(Math.max(page - 1, 1));
  const next = () => onChange(Math.min(page + 1, totalPages));
  const go = (p) => onChange(p);

  const pages = [];
  const maxButtons = 5;
  let start = Math.max(1, page - Math.floor(maxButtons / 2));
  let end = Math.min(totalPages, start + maxButtons - 1);
  if (end - start + 1 < maxButtons) {
    start = Math.max(1, end - maxButtons + 1);
  }
  for (let i = start; i <= end; i++) pages.push(i);

  return (
    <div className="flex items-center justify-center gap-2 mt-6 flex-wrap">
      <button
        onClick={prev}
        disabled={page === 1}
        className="px-3 py-1.5 text-sm rounded border border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        ← Prev
      </button>

      {start > 1 && (
        <>
          <button
            onClick={() => go(1)}
            className="px-3 py-1.5 text-sm rounded border border-gray-300 bg-white hover:bg-gray-50"
          >
            1
          </button>
          {start > 2 && <span className="text-gray-400 px-1">…</span>}
        </>
      )}

      {pages.map((p) => (
        <button
          key={p}
          onClick={() => go(p)}
          aria-current={p === page ? 'page' : undefined}
          className={`px-3 py-1.5 text-sm rounded border ${
            p === page
              ? 'bg-brand text-white border-brand'
              : 'bg-white border-gray-300 hover:bg-gray-50'
          }`}
        >
          {p}
        </button>
      ))}

      {end < totalPages && (
        <>
          {end < totalPages - 1 && <span className="text-gray-400 px-1">…</span>}
          <button
            onClick={() => go(totalPages)}
            className="px-3 py-1.5 text-sm rounded border border-gray-300 bg-white hover:bg-gray-50"
          >
            {totalPages}
          </button>
        </>
      )}

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
