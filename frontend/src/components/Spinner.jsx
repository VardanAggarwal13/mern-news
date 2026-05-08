export default function Spinner({ label = 'Loading…' }) {
  return (
    <div className="flex flex-col items-center justify-center py-10 text-gray-500">
      <div
        className="w-8 h-8 border-2 border-gray-200 border-t-brand rounded-full animate-spin"
        role="status"
        aria-label={label}
      />
      <p className="mt-3 text-sm">{label}</p>
    </div>
  );
}
