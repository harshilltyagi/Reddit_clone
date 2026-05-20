import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { api } from "../lib/api";
import { useAuth } from "../context/AuthContext";

export default function PostDetailPage() {
  const { slug, id } = useParams();
  const navigate = useNavigate();
  const { user, isLoggedIn } = useAuth();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [vote, setVote] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    Promise.all([api.getPost(id), api.getComments(id)])
      .then(([postData, commentsData]) => {
        setPost(postData);
        setComments(Array.isArray(commentsData) ? commentsData : []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  const handleVote = async (dir) => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }
    const newVote = vote === dir ? 0 : dir;
    setVote(newVote);
    await api
      .vote(id, newVote === 1 ? "UPVOTE" : "DOWNVOTE")
      .catch(console.error);
  };

  const handleComment = async () => {
    if (!newComment.trim() || !isLoggedIn) return;
    setSubmitting(true);
    try {
      const data = await api.addComment(id, newComment);
      setComments((c) => [data, ...c]);
      setNewComment("");
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const fmt = (n) => (n >= 1000 ? (n / 1000).toFixed(1) + "k" : n);

  if (loading)
    return (
      <div className="max-w-5xl mx-auto px-4 py-6 flex gap-6">
        <div className="flex-1 space-y-3">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="bg-white border border-gray-300 rounded-sm h-32 animate-pulse"
            />
          ))}
        </div>
        <div className="w-72 shrink-0 hidden lg:block">
          <div className="bg-white border border-gray-300 rounded-sm h-48 animate-pulse" />
        </div>
      </div>
    );

  if (!post)
    return (
      <div className="max-w-5xl mx-auto px-4 py-12 text-center">
        <div className="text-5xl mb-3">🔍</div>
        <h2 className="font-bold text-gray-700">Post not found</h2>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 text-[#FF4500] hover:underline text-sm font-semibold"
        >
          Go back
        </button>
      </div>
    );

  const score = (post.upvotes ?? 0) - (post.downvotes ?? 0) + vote;

  return (
    <div className="max-w-5xl mx-auto px-4 py-4 flex gap-6">
      <div className="flex-1 min-w-0">
        <div className="text-xs text-gray-500 mb-3 flex items-center gap-1">
          <Link to="/" className="hover:underline">
            Home
          </Link>
          <span>›</span>
          <Link
            to={`/r/${slug}`}
            className="text-[#FF4500] font-semibold hover:underline"
          >
            r/{slug}
          </Link>
          <span>›</span>
          <span className="truncate">{post.title}</span>
        </div>

        {/* Post */}
        <div className="bg-white border border-gray-300 rounded-sm flex mb-3">
          <div className="bg-gray-50 w-10 flex flex-col items-center py-3 gap-1 rounded-l-sm shrink-0">
            <button
              onClick={() => handleVote(1)}
              className={`p-0.5 rounded hover:bg-orange-100 transition-colors ${vote === 1 ? "text-[#FF4500]" : "text-gray-400"}`}
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 4l8 8H4z" />
              </svg>
            </button>
            <span
              className={`text-sm font-bold ${vote === 1 ? "text-[#FF4500]" : vote === -1 ? "text-[#7193FF]" : "text-gray-700"}`}
            >
              {fmt(score)}
            </span>
            <button
              onClick={() => handleVote(-1)}
              className={`p-0.5 rounded hover:bg-blue-100 transition-colors ${vote === -1 ? "text-[#7193FF]" : "text-gray-400"}`}
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 20l-8-8h16z" />
              </svg>
            </button>
          </div>
          <div className="p-4 flex-1 min-w-0">
            <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-2 flex-wrap">
              <Link
                to={`/r/${slug}`}
                className="font-bold text-gray-900 hover:underline"
              >
                r/{post.community?.name ?? slug}
              </Link>
              <span>•</span>
              <span>Posted by u/{post.author?.username ?? "unknown"}</span>
              <span>•</span>
              <span>
                {new Date(post.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </span>
            </div>
            <h1 className="text-xl font-bold text-gray-900 leading-snug mb-3">
              {post.title}
            </h1>
            {/* Image */}
            {post.imageUrl && (
              <img
                src={post.imageUrl}
                alt={post.title}
                className="w-full rounded max-h-96 object-contain bg-gray-100 mb-3"
                onError={(e) => (e.target.style.display = "none")}
              />
            )}
            {post.content && (
              <p className="text-sm text-gray-700 leading-relaxed mb-4 whitespace-pre-wrap">
                {post.content}
              </p>
            )}
            <div className="flex items-center gap-1 text-xs font-bold text-gray-500">
              <span>
                💬 {fmt(post._count?.comments ?? comments.length)} Comments
              </span>
            </div>
          </div>
        </div>

        {/* Comment box */}
        <div className="bg-white border border-gray-300 rounded-sm p-4 mb-3">
          {isLoggedIn ? (
            <>
              <p className="text-xs text-gray-500 mb-2">
                Comment as{" "}
                <span className="text-[#FF4500] font-semibold">
                  {user?.username}
                </span>
              </p>
              <textarea
                rows={4}
                placeholder="What are your thoughts?"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="w-full border border-gray-300 rounded p-3 text-sm outline-none focus:border-[#FF4500] resize-none placeholder-gray-400"
              />
              <div className="flex justify-end mt-2">
                <button
                  onClick={handleComment}
                  disabled={!newComment.trim() || submitting}
                  className="bg-[#FF4500] hover:bg-[#e03d00] disabled:opacity-50 text-white font-bold rounded-full px-5 py-1.5 text-sm transition-colors"
                >
                  {submitting ? "Posting..." : "Comment"}
                </button>
              </div>
            </>
          ) : (
            <p className="text-sm text-center text-gray-600 py-2">
              <Link
                to="/login"
                className="text-[#FF4500] font-semibold hover:underline"
              >
                Log in
              </Link>{" "}
              or{" "}
              <Link
                to="/signup"
                className="text-[#FF4500] font-semibold hover:underline"
              >
                sign up
              </Link>{" "}
              to comment
            </p>
          )}
        </div>

        {/* Comments */}
        <div className="space-y-2">
          {comments.length === 0 ? (
            <div className="bg-white border border-gray-300 rounded-sm p-8 text-center">
              <div className="text-4xl mb-2">💬</div>
              <p className="text-sm text-gray-500">
                No comments yet. Be the first!
              </p>
            </div>
          ) : (
            comments.map((c) => (
              <div
                key={c.id}
                className="bg-white border border-gray-300 rounded-sm p-4"
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 rounded-full bg-[#FF4500] flex items-center justify-center text-white text-xs font-bold shrink-0">
                    {c.author?.username?.[0]?.toUpperCase() ?? "?"}
                  </div>
                  <span className="text-xs font-bold text-gray-900">
                    {c.author?.username ?? "unknown"}
                  </span>
                  <span className="text-xs text-gray-400">
                    {new Date(c.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed pl-8">
                  {c.content}
                </p>
                <div className="flex items-center gap-3 mt-2 pl-8">
                  <button className="text-xs font-bold text-gray-400 hover:text-[#FF4500]">
                    ▲
                  </button>
                  <span className="text-xs font-bold text-gray-600">1</span>
                  <button className="text-xs font-bold text-gray-400 hover:text-[#7193FF]">
                    ▼
                  </button>
                  <button className="text-xs font-bold text-gray-400 hover:text-gray-600">
                    Reply
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <aside className="w-72 shrink-0 hidden lg:block">
        <Sidebar />
      </aside>
    </div>
  );
}
