import { useEffect, useState } from 'react';
import api from '../api/axios';
import StoryCard from '../components/StoryCard';
import Pagination from '../components/Pagination';

const LIMIT = 10;

export default function Home() {
  const [stories, setStories] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    const fetchStories = async () => {
      setLoading(true);
      setError('');
      try {
        const { data } = await api.get('/stories', {
          params: { page, limit: LIMIT },
        });
        if (cancelled) return;
        setStories(data.stories);
        setTotalPages(data.totalPages);
      } catch (err) {
        if (cancelled) return;
        setError(err.response?.data?.message || 'Failed to load stories');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchStories();
    return () => {
      cancelled = true;
    };
  }, [page]);

  return (
    <div>
      <div className="flex items-baseline justify-between mb-4">
        <h2 className="text-xl font-bold">Top Stories</h2>
        <span className="text-xs text-gray-500">from Hacker News</span>
      </div>

      {loading && (
        <div className="text-center py-10 text-gray-500">Loading stories…</div>
      )}

      {error && !loading && (
        <div className="p-4 rounded bg-red-50 border border-red-200 text-red-700 text-sm">
          {error}
        </div>
      )}

      {!loading && !error && stories.length === 0 && (
        <div className="text-center py-10 text-gray-500">
          No stories yet. Trigger a scrape from the backend.
        </div>
      )}

      {!loading && !error && stories.length > 0 && (
        <>
          <div className="space-y-3">
            {stories.map((story, i) => (
              <StoryCard
                key={story._id}
                story={story}
                index={(page - 1) * LIMIT + i + 1}
              />
            ))}
          </div>
          <Pagination page={page} totalPages={totalPages} onChange={setPage} />
        </>
      )}
    </div>
  );
}
