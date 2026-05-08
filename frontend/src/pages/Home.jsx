import { useEffect, useState } from 'react';
import api from '../api/axios';
import StoryCard from '../components/StoryCard';
import Pagination from '../components/Pagination';
import Spinner from '../components/Spinner';

const PAGE_SIZE_OPTIONS = [3, 5, 10];
const LIMIT_STORAGE_KEY = 'hn-reader:limit';
const DEFAULT_LIMIT = 5;

const readStoredLimit = () => {
  const stored = Number(localStorage.getItem(LIMIT_STORAGE_KEY));
  return PAGE_SIZE_OPTIONS.includes(stored) ? stored : DEFAULT_LIMIT;
};

export default function Home() {
  const [stories, setStories] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(readStoredLimit);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [refreshTick, setRefreshTick] = useState(0);

  useEffect(() => {
    let cancelled = false;
    const fetchStories = async () => {
      setLoading(true);
      setError('');
      try {
        const { data } = await api.get('/stories', { params: { page, limit } });
        if (cancelled) return;
        setStories(data.stories);
        setTotalPages(data.totalPages);
        setTotal(data.total);
        if (page > data.totalPages && data.totalPages > 0) {
          setPage(data.totalPages);
        }
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
  }, [page, limit, refreshTick]);

  const handleRefresh = async () => {
    setRefreshing(true);
    setError('');
    try {
      await api.post('/scrape');
      setPage(1);
      setRefreshTick((t) => t + 1);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to refresh stories');
    } finally {
      setRefreshing(false);
    }
  };

  const handleLimitChange = (e) => {
    const value = Number(e.target.value);
    setLimit(value);
    localStorage.setItem(LIMIT_STORAGE_KEY, String(value));
    setPage(1);
  };

  const rangeStart = total === 0 ? 0 : (page - 1) * limit + 1;
  const rangeEnd = Math.min(page * limit, total);

  return (
    <div>
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-bold">Top Stories</h2>
          <span className="text-xs text-gray-500">from Hacker News</span>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600">
            Per page:{' '}
            <select
              value={limit}
              onChange={handleLimitChange}
              className="ml-1 border border-gray-300 rounded px-2 py-1 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand"
            >
              {PAGE_SIZE_OPTIONS.map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </label>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="px-3 py-1.5 text-sm rounded border border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-50"
          >
            {refreshing ? 'Refreshing…' : '↻ Refresh'}
          </button>
        </div>
      </div>

      {loading && <Spinner label="Loading stories…" />}

      {error && !loading && (
        <div className="p-4 rounded bg-red-50 border border-red-200 text-red-700 text-sm">
          {error}
        </div>
      )}

      {!loading && !error && stories.length === 0 && (
        <div className="text-center py-10 text-gray-500">
          <p className="mb-3">No stories yet.</p>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="inline-block px-4 py-2 rounded bg-brand text-white text-sm font-medium hover:bg-brand-dark disabled:opacity-50"
          >
            Run scraper now
          </button>
        </div>
      )}

      {!loading && !error && stories.length > 0 && (
        <>
          <div className="text-xs text-gray-500 mb-2">
            Showing <span className="font-medium">{rangeStart}</span>–
            <span className="font-medium">{rangeEnd}</span> of{' '}
            <span className="font-medium">{total}</span>
          </div>
          <div className="space-y-3">
            {stories.map((story, i) => (
              <StoryCard
                key={story._id}
                story={story}
                index={(page - 1) * limit + i + 1}
              />
            ))}
          </div>
          <Pagination page={page} totalPages={totalPages} onChange={setPage} />
        </>
      )}
    </div>
  );
}
