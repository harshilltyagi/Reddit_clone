import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function PostCard({ post }) {
  const [vote, setVote] = useState(0);
  const navigate = useNavigate();
  const score = (post.votes ?? post._count?.votes ?? 0) + vote;

  const fmt = (n) => (n >= 1000 ? (n / 1000).toFixed(1) + "k" : n);

  const handleVote = (e, dir) => {
    e.stopPropagation();
    setVote((v) => (v === dir ? 0 : dir));
  };

  return (
    <div
      className="bg-white border border-gray-300 rounded-sm hover:border-gray-400 cursor-pointer flex transition-colors"
      onClick={() => navigate(`/r/${post.community?.slug}/comments/${post.id}`)}
    >
      {/* Vote column */}
      <div className="bg-gray-50 w-10 flex flex-col items-center py-2 gap-1 rounded-l-sm shrink-0">
        <button
          onClick={(e) => handleVote(e, 1)}
          className={`p-0.5 rounded hover:bg-orange-100 transition-colors ${vote === 1 ? "text-[#FF4500]" : "text-gray-400"}`}
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 4l8 8H4z" />
          </svg>
        </button>
        <span
          className={`text-xs font-bold ${vote === 1 ? "text-[#FF4500]" : vote === -1 ? "text-[#7193FF]" : "text-gray-700"}`}
        >
          {fmt(score)}
        </span>
        <button
          onClick={(e) => handleVote(e, -1)}
          className={`p-0.5 rounded hover:bg-blue-100 transition-colors ${vote === -1 ? "text-[#7193FF]" : "text-gray-400"}`}
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 20l-8-8h16z" />
          </svg>
        </button>
      </div>

      {/* Post content */}
      <div className="p-2 flex-1 min-w-0">
        {/* Meta */}
        <div className="flex items-center gap-1 text-xs text-gray-500 mb-1 flex-wrap">
          <span
            className="font-semibold text-gray-900 hover:underline"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/r/${post.community?.slug}`);
            }}
          >
            r/{post.community?.name ?? post.community?.slug}
          </span>
          <span>•</span>
          <span>Posted by u/{post.author?.username ?? "unknown"}</span>
          <span>•</span>
          <span>{new Date(post.createdAt).toLocaleDateString()}</span>
        </div>

        {/* Title */}
        <h3 className="text-base font-medium text-gray-900 leading-snug mb-1">
          {post.title}
          {post.type === "link" && (
            <span className="ml-2 text-xs text-[#0079D3] font-normal">
              🔗 link
            </span>
          )}
        </h3>

        {/* Image */}
        {post.imageUrl && post.type === "image" && (
          <img
            src={post.imageUrl}
            alt={post.title}
            className="w-full max-h-80 object-cover rounded mb-2"
            onError={(e) => (e.target.style.display = "none")}
          />
        )}
        {/* Text preview */}
        {post.content && post.type !== "link" && (
          <p className="text-sm text-gray-600 line-clamp-3 mb-2">
            {post.content}
          </p>
        )}

        {/* Actions */}
        <div className="flex items-center gap-1 flex-wrap">
          <button
            className="flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:bg-gray-100 rounded px-2 py-1.5 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/r/${post.community?.slug}/comments/${post.id}`);
            }}
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
            {fmt(post._count?.comments ?? post.comments ?? 0)} Comments
          </button>
          <button
            className="flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:bg-gray-100 rounded px-2 py-1.5 transition-colors"
            onClick={(e) => e.stopPropagation()}
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
              />
            </svg>
            Share
          </button>
          <button
            className="flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:bg-gray-100 rounded px-2 py-1.5 transition-colors"
            onClick={(e) => e.stopPropagation()}
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
              />
            </svg>
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
