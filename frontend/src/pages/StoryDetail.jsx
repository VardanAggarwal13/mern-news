import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../api/axios';
import BookmarkButton from '../components/BookmarkButton';

export default function StoryDetail() {
  const { id } = useParams();
  const [story, setStory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    const fetchStory = async () => {
      setLoading(true);
      setError('');
      try {
        const { data } = await api.get(`/stories/${id}`);
        if (!cancelled) setStory(data);
      } catch (err) {
        if (!cancelled) {
          setError(err.response?.data?.message || 'Failed to load story');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchStory();
    return () => {
      cancelled = true;
    };
  }, [id]);

  return (
    <div>
      <Link
        to="/"
        className="inline-block text-sm text-gray-600 hover:text-brand mb-4"
      >
        ← Back to stories
      </Link>

      {loading && (
        <div className="text-center py-10 text-gray-500">Loading story…</div>
      )}

      {error && !loading && (
        <div className="p-4 rounded bg-red-50 border border-red-200 text-red-700 text-sm">
          {error}
        </div>
      )}

      {!loading && !error && story && (
        <article className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-start justify-between gap-4 mb-3">
            <h1 className="text-2xl font-bold leading-tight flex-1">
              {story.title}
            </h1>
            <BookmarkButton storyId={story._id} />
          </div>

          <a
            href={story.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-brand hover:underline break-all"
          >
            {story.url}
          </a>

          <dl className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
            <div>
              <dt className="text-gray-500">Points</dt>
              <dd className="font-semibold text-gray-900">{story.points}</dd>
            </div>
            <div>
              <dt className="text-gray-500">Author</dt>
              <dd className="font-semibold text-gray-900">{story.author}</dd>
            </div>
            <div>
              <dt className="text-gray-500">Posted</dt>
              <dd className="font-semibold text-gray-900">
                {story.postedAt || '—'}
              </dd>
            </div>
            <div>
              <dt className="text-gray-500">HN ID</dt>
              <dd className="font-mono text-gray-900">{story.hnId}</dd>
            </div>
          </dl>
        </article>
      )}
    </div>
  );
}
