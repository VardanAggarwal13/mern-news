import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function BookmarkButton({ storyId, className = '' }) {
  const { isAuthenticated, bookmarkIds, toggleBookmark } = useAuth();
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);

  const isBookmarked = bookmarkIds.has(storyId);

  const handleClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      navigate('/login', { state: { from: window.location.pathname } });
      return;
    }

    setBusy(true);
    try {
      await toggleBookmark(storyId);
    } catch (err) {
      console.error('Bookmark toggle failed:', err);
    } finally {
      setBusy(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={busy}
      aria-pressed={isBookmarked}
      aria-label={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium border transition disabled:opacity-50 ${
        isBookmarked
          ? 'bg-brand text-white border-brand hover:bg-brand-dark'
          : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
      } ${className}`}
    >
      <span aria-hidden="true">{isBookmarked ? '★' : '☆'}</span>
      <span>{isBookmarked ? 'Bookmarked' : 'Bookmark'}</span>
    </button>
  );
}
