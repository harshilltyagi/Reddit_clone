import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import PostCard from "../components/PostCard";
import Sidebar from "../components/Sidebar";
import { api } from "../lib/api";
import { useAuth } from "../context/AuthContext";

export default function CommunityPage({ onCreatePost }) {
  const { slug } = useParams();
  const [posts, setPosts] = useState([]);
  const [community, setCommunity] = useState(null);
  const [sort, setSort] = useState("latest");
  const [loading, setLoading] = useState(true);
  const [joined, setJoined] = useState(false);
  const { isLoggedIn } = useAuth();

  useEffect(() => {
    api.getCommunity(slug).then(setCommunity).catch(console.error);
  }, [slug]);

  useEffect(() => {
    setLoading(true);
    api
      .getPosts({ communitySlug: slug, sort })
      .then((d) => setPosts(d.posts ?? []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [slug, sort]);

  const handleJoin = async () => {
    if (!isLoggedIn) return;
    try {
      joined ? await api.leaveCommunity(slug) : await api.joinCommunity(slug);
      setJoined((j) => !j);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <div className="h-16 bg-[#FF4500]" />
      <div className="bg-white border-b border-gray-300 mb-4">
        <div className="max-w-5xl mx-auto px-4 flex items-end gap-4 pb-3 -mt-3">
          <div className="w-16 h-16 rounded-full border-4 border-white bg-[#FF4500] flex items-center justify-center text-white text-2xl font-bold shrink-0">
            {community?.name?.[0]?.toUpperCase() ?? "?"}
          </div>
          <div className="flex-1 min-w-0 pb-1">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl font-bold text-gray-900">
                r/{community?.name ?? slug}
              </h1>
              {isLoggedIn && (
                <button
                  onClick={handleJoin}
                  className={`font-bold rounded-full px-5 py-1.5 text-sm transition-colors ${joined ? "border-2 border-[#FF4500] text-[#FF4500] hover:bg-orange-50" : "bg-[#FF4500] text-white hover:bg-[#e03d00]"}`}
                >
                  {joined ? "Joined" : "Join"}
                </button>
              )}
              <button
                onClick={onCreatePost}
                className="border border-gray-300 text-gray-700 font-bold rounded-full px-4 py-1.5 text-sm hover:bg-gray-50 transition-colors"
              >
                + Create Post
              </button>
            </div>
            {community?.description && (
              <p className="text-sm text-gray-500 mt-0.5">
                {community.description}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 flex gap-6">
        <div className="flex-1 min-w-0">
          <div className="bg-white border border-gray-300 rounded-sm px-3 py-2 flex gap-1 mb-4">
            {[
              ["🔥", "hot", "Hot"],
              ["⚡", "latest", "New"],
              ["📈", "top", "Top"],
            ].map(([icon, key, label]) => (
              <button
                key={key}
                onClick={() => setSort(key)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-sm font-bold transition-colors ${sort === key ? "bg-gray-100 text-[#FF4500]" : "text-gray-500 hover:bg-gray-50"}`}
              >
                {icon} {label}
              </button>
            ))}
          </div>
          {loading ? (
            <div className="space-y-3">
              {[...Array(4)].map((_, i) => (
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
              <button
                onClick={onCreatePost}
                className="mt-3 bg-[#FF4500] text-white font-bold rounded-full px-6 py-2 text-sm hover:bg-[#e03d00] transition-colors"
              >
                Create Post
              </button>
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
          <Sidebar
            communityInfo={
              community
                ? {
                    name: community.name,
                    description: community.description,
                    memberCount: community._count?.members,
                  }
                : null
            }
          />
        </aside>
      </div>
    </>
  );
}
