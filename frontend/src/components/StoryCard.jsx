import { Link } from 'react-router-dom';
import BookmarkButton from './BookmarkButton';

export default function StoryCard({ story, index }) {
  return (
    <article className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-sm transition">
      <div className="flex items-start gap-3">
        {typeof index === 'number' && (
          <div className="text-gray-400 font-medium text-sm w-6 pt-0.5 shrink-0">
            {index}.
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-semibold leading-snug">
            <a
              href={story.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-900 hover:text-brand"
            >
              {story.title}
            </a>
          </h3>
          <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500">
            <span className="font-medium text-brand">
              {story.points} {story.points === 1 ? 'point' : 'points'}
            </span>
            <span>by {story.author}</span>
            {story.postedAt && <span>{story.postedAt}</span>}
            <Link
              to={`/stories/${story._id}`}
              className="text-gray-500 hover:text-brand hover:underline"
            >
              details
            </Link>
          </div>
        </div>
        <BookmarkButton storyId={story._id} />
      </div>
    </article>
  );
}
