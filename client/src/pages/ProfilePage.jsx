import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../lib/api";
import { useAuth } from "../context/AuthContext";
import PostCard from "../components/PostCard";

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("posts");

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    api
      .getPosts({ limit: 100 })
      .then((d) => {
        const allPosts = d.posts ?? [];
        const myPosts = allPosts.filter(
          (p) => p.author?.id === user.id || p.authorId === user.id,
        );
        setPosts(myPosts);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // ✅ Upvotes received on YOUR posts only
  const totalVotesReceived = posts.reduce(
    (acc, p) => acc + (p.upvotes ?? 0),
    0,
  );

  if (!user) return null;

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 flex gap-6">
      {/* Main */}
      <div className="flex-1 min-w-0">
        {/* Tabs */}
        <div className="bg-white border border-gray-300 rounded-sm px-3 py-2 flex gap-1 mb-4">
          {[
            ["posts", "📝", "Posts"],
            ["comments", "💬", "Comments"],
          ].map(([key, icon, label]) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-sm font-bold transition-colors ${
                activeTab === key
                  ? "bg-gray-100 text-[#FF4500]"
                  : "text-gray-500 hover:bg-gray-50"
              }`}
            >
              {icon} {label}
            </button>
          ))}
        </div>

        {/* Posts tab */}
        {activeTab === "posts" && (
          <>
            {loading ? (
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
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
                <p className="text-sm text-gray-500 mb-4">
                  You haven't posted anything yet.
                </p>
                <button
                  onClick={() => navigate("/")}
                  className="bg-[#FF4500] text-white font-bold rounded-full px-6 py-2 text-sm hover:bg-[#e03d00] transition-colors"
                >
                  Create a Post
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {posts.map((p) => (
                  <PostCard key={p.id} post={p} />
                ))}
              </div>
            )}
          </>
        )}

        {/* Comments tab */}
        {activeTab === "comments" && (
          <div className="bg-white border border-gray-300 rounded-sm p-12 text-center">
            <div className="text-5xl mb-3">💬</div>
            <h3 className="font-bold text-gray-700 mb-1">No comments yet</h3>
            <p className="text-sm text-gray-500">
              Comments you make will appear here.
            </p>
          </div>
        )}
      </div>

      {/* Sidebar */}
      <aside className="w-72 shrink-0 hidden lg:block">
        <div className="bg-white border border-gray-300 rounded-sm overflow-hidden mb-4">
          {/* Banner */}
          <div className="bg-[#FF4500] h-12" />

          <div className="px-4 pb-4">
            {/* Avatar */}
            <div className="w-16 h-16 rounded-full bg-[#FF4500] border-4 border-white flex items-center justify-center text-white font-bold text-2xl -mt-8 mb-3">
              {user.username?.[0]?.toUpperCase()}
            </div>

            {/* User info */}
            <h2 className="font-bold text-lg text-gray-900">
              u/{user.username}
            </h2>
            <p className="text-xs text-gray-500 mb-4">{user.email}</p>

            {/* Stats */}
            <div className="flex gap-4 mb-4 pb-4 border-b border-gray-200">
              <div>
                <div className="font-bold text-sm">{posts.length}</div>
                <div className="text-xs text-gray-500">My Posts</div>
              </div>
              <div>
                <div className="font-bold text-sm text-[#FF4500]">
                  {totalVotesReceived}
                </div>
                <div className="text-xs text-gray-500">Upvotes Received</div>
              </div>
              <div>
                <div className="font-bold text-sm">
                  {posts.reduce((acc, p) => acc + (p._count?.comments ?? 0), 0)}
                </div>
                <div className="text-xs text-gray-500">Comments</div>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-2">
              <button
                onClick={() => navigate("/")}
                className="w-full bg-[#FF4500] hover:bg-[#e03d00] text-white font-bold rounded-full py-1.5 text-sm transition-colors"
              >
                + New Post
              </button>
              <button
                onClick={() => navigate("/create-community")}
                className="w-full border border-[#FF4500] text-[#FF4500] font-bold rounded-full py-1.5 text-sm hover:bg-orange-50 transition-colors"
              >
                + New Community
              </button>
              <button
                onClick={handleLogout}
                className="w-full border border-gray-300 text-gray-600 font-bold rounded-full py-1.5 text-sm hover:bg-gray-50 transition-colors"
              >
                Log Out
              </button>
            </div>
          </div>
        </div>

        {/* Joined since */}
        <div className="bg-white border border-gray-300 rounded-sm p-3">
          <h3 className="font-bold text-sm mb-2">Account Info</h3>
          <div className="text-xs text-gray-500 space-y-1">
            <div className="flex justify-between">
              <span>Username</span>
              <span className="font-semibold text-gray-700">
                u/{user.username}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Email</span>
              <span className="font-semibold text-gray-700">{user.email}</span>
            </div>
            <div className="flex justify-between">
              <span>Total Posts</span>
              <span className="font-semibold text-gray-700">
                {posts.length}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Upvotes Received</span>
              <span className="font-semibold text-[#FF4500]">
                {totalVotesReceived}
              </span>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
