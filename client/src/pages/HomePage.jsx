import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PostCard from "../components/PostCard";
import Sidebar from "../components/Sidebar";
import { api } from "../lib/api";
import { useAuth } from "../context/AuthContext";

export default function HomePage({ onCreatePost }) {
  const [posts, setPosts] = useState([]);
  const [sort, setSort] = useState("latest");
  const [loading, setLoading] = useState(true);
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    api
      .getPosts({ sort, limit: 20 })
      .then((d) => setPosts(d.posts ?? []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [sort]);

  return (
    <div className="max-w-5xl mx-auto px-4 py-4 flex gap-6">
      <div className="flex-1 min-w-0">
        {/* Create bar */}
        <div className="bg-white border border-gray-300 rounded-sm p-2 flex gap-2 items-center mb-4">
          <div className="w-8 h-8 rounded-sm bg-gray-200 flex items-center justify-center shrink-0">
            <svg
              className="w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </div>
          <input
            readOnly
            placeholder="Create Post"
            onClick={() => (isLoggedIn ? onCreatePost() : navigate("/login"))}
            className="flex-1 border border-gray-300 rounded px-3 py-1.5 text-sm text-gray-500 cursor-pointer hover:border-[#FF4500] outline-none bg-gray-50 hover:bg-white transition-colors"
          />
        </div>

        {/* Sort */}
        <div className="bg-white border border-gray-300 rounded-sm px-3 py-2 flex gap-1 mb-4">
          {[
            ["🔥", "hot", "Hot"],
            ["⚡", "latest", "New"],
            ["📈", "top", "Top"],
            ["🌱", "rising", "Rising"],
          ].map(([icon, key, label]) => (
            <button
              key={key}
              onClick={() => setSort(key)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-sm font-bold transition-colors ${sort === key ? "bg-gray-100 text-[#FF4500]" : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"}`}
            >
              {icon} {label}
            </button>
          ))}
        </div>

        {/* Posts */}
        {loading ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="bg-white border border-gray-300 rounded-sm h-32 animate-pulse"
              />
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="bg-white border border-gray-300 rounded-sm p-12 text-center">
            <div className="text-5xl mb-3">📭</div>
            <h3 className="font-bold text-gray-700 mb-1">No posts yet</h3>
            <p className="text-sm text-gray-500">
              Be the first to post something!
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {posts.map((p) => (
              <PostCard key={p.id} post={p} />
            ))}
          </div>
        )}
      </div>
      <aside className="w-72 shrink-0 hidden lg:block">
        <Sidebar />
      </aside>
    </div>
  );
}
