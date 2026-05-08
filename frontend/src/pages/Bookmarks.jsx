import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import StoryCard from '../components/StoryCard';
import { useAuth } from '../context/AuthContext';

export default function Bookmarks() {
  const { bookmarkIds } = useAuth();
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    const fetchBookmarks = async () => {
      setLoading(true);
      setError('');
      try {
        const { data } = await api.get('/users/me/bookmarks');
        if (!cancelled) setStories(data.stories || []);
      } catch (err) {
        if (!cancelled) {
          setError(err.response?.data?.message || 'Failed to load bookmarks');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchBookmarks();
    return () => {
      cancelled = true;
    };
  }, []);

  const visibleStories = useMemo(
    () => stories.filter((s) => bookmarkIds.has(s._id)),
    [stories, bookmarkIds]
  );

  return (
    <div>
      <div className="flex items-baseline justify-between mb-4">
        <h2 className="text-xl font-bold">Your Bookmarks</h2>
        {!loading && !error && (
          <span className="text-xs text-gray-500">
            {visibleStories.length}{' '}
            {visibleStories.length === 1 ? 'story' : 'stories'}
          </span>
        )}
      </div>

      {loading && (
        <div className="text-center py-10 text-gray-500">
          Loading bookmarks…
        </div>
      )}

      {error && !loading && (
        <div className="p-4 rounded bg-red-50 border border-red-200 text-red-700 text-sm">
          {error}
        </div>
      )}

      {!loading && !error && visibleStories.length === 0 && (
        <div className="text-center py-10 text-gray-500">
          <p className="mb-3">You haven&apos;t bookmarked any stories yet.</p>
          <Link
            to="/"
            className="inline-block px-4 py-2 rounded bg-brand text-white text-sm font-medium hover:bg-brand-dark"
          >
            Browse stories
          </Link>
        </div>
      )}

      {!loading && !error && visibleStories.length > 0 && (
        <div className="space-y-3">
          {visibleStories.map((story, i) => (
            <StoryCard key={story._id} story={story} index={i + 1} />
          ))}
        </div>
      )}
    </div>
  );
}
