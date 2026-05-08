import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="text-center py-16">
      <p className="text-5xl font-bold text-brand mb-2">404</p>
      <h2 className="text-xl font-semibold mb-2">Page not found</h2>
      <p className="text-gray-500 mb-6">
        The page you&apos;re looking for doesn&apos;t exist.
      </p>
      <Link
        to="/"
        className="inline-block px-4 py-2 rounded bg-brand text-white text-sm font-medium hover:bg-brand-dark"
      >
        Back to home
      </Link>
    </div>
  );
}
