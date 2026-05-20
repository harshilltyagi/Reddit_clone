import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../lib/api";

export default function CreatePostModal({ onClose }) {
  const [tab, setTab] = useState("text");
  const [form, setForm] = useState({
    title: "",
    content: "",
    imageUrl: "",
    community: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [communities, setCommunities] = useState([]);
  const [imagePreview, setImagePreview] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api
      .getCommunities()
      .then((d) => setCommunities(d.communities ?? []))
      .catch(console.error);
  }, []);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async () => {
    if (!form.title || !form.community) return;
    setLoading(true);
    setError("");
    try {
      const data = await api.createPost({
        ...form,
        type: tab,
        communitySlug: form.community,
      });
      onClose();
      navigate(`/r/${form.community}/comments/${data.id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-lg w-full max-w-xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-bold text-gray-900">Create Post</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
          >
            &times;
          </button>
        </div>

        <div className="p-4 space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Community picker */}
          <select
            value={form.community}
            onChange={set("community")}
            className="w-full border border-gray-300 rounded-full px-4 py-2 text-sm outline-none focus:border-[#FF4500] text-gray-700"
          >
            <option value="">Choose a community</option>
            {communities.map((c) => (
              <option key={c.id} value={c.slug}>
                r/{c.name}
              </option>
            ))}
          </select>

          {/* Post type tabs */}
          <div className="flex border-b border-gray-200">
            {[
              ["text", "📝 Post"],
              ["image", "🖼️ Image"],
              ["link", "🔗 Link"],
            ].map(([key, label]) => (
              <button
                key={key}
                onClick={() => setTab(key)}
                className={`flex-1 py-2.5 text-sm font-bold border-b-2 transition-colors ${
                  tab === key
                    ? "border-[#FF4500] text-[#FF4500]"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Title */}
          <div>
            <input
              type="text"
              placeholder="Title"
              maxLength={300}
              value={form.title}
              onChange={set("title")}
              className="w-full border border-gray-300 rounded px-3 py-2.5 text-sm outline-none focus:border-[#FF4500] placeholder-gray-400"
            />
            <div className="text-right text-xs text-gray-400 mt-1">
              {form.title.length}/300
            </div>
          </div>

          {/* TEXT tab */}
          {tab === "text" && (
            <textarea
              placeholder="Text (optional)"
              value={form.content}
              onChange={set("content")}
              rows={5}
              className="w-full border border-gray-300 rounded px-3 py-2.5 text-sm outline-none focus:border-[#FF4500] placeholder-gray-400 resize-none"
            />
          )}

          {/* IMAGE tab */}
          {tab === "image" && (
            <div className="space-y-3">
              {/* URL Input */}
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-1">
                  Image URL
                </label>
                <input
                  type="url"
                  placeholder="https://example.com/image.jpg"
                  value={form.imageUrl}
                  onChange={(e) => {
                    set("imageUrl")(e);
                    setImagePreview(true);
                  }}
                  className="w-full border border-gray-300 rounded px-3 py-2.5 text-sm outline-none focus:border-[#FF4500] placeholder-gray-400"
                />
              </div>

              {/* Image Preview */}
              {form.imageUrl && imagePreview && (
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-1">
                    Preview
                  </label>
                  <img
                    src={form.imageUrl}
                    alt="Preview"
                    className="w-full max-h-56 object-cover rounded border border-gray-200"
                    onError={() => setImagePreview(false)}
                    onLoad={() => setImagePreview(true)}
                  />
                </div>
              )}

              {/* Invalid URL warning */}
              {form.imageUrl && !imagePreview && (
                <div className="bg-red-50 border border-red-200 text-red-600 text-xs px-3 py-2 rounded">
                  ⚠️ Could not load image. Please check the URL.
                </div>
              )}

              {/* Hint */}
              <div className="bg-gray-50 border border-gray-200 rounded p-3">
                <p className="text-xs text-gray-600 font-semibold mb-1">
                  💡 How to get an image URL:
                </p>
                <ol className="text-xs text-gray-500 space-y-1 list-decimal list-inside">
                  <li>
                    Go to{" "}
                    <a
                      href="https://imgur.com/upload"
                      target="_blank"
                      rel="noreferrer"
                      className="text-[#FF4500] hover:underline font-medium"
                    >
                      imgur.com
                    </a>{" "}
                    or{" "}
                    <a
                      href="https://imgbb.com"
                      target="_blank"
                      rel="noreferrer"
                      className="text-[#FF4500] hover:underline font-medium"
                    >
                      imgbb.com
                    </a>
                  </li>
                  <li>Upload your image</li>
                  <li>Copy the direct image link</li>
                  <li>Paste it above</li>
                </ol>
              </div>
            </div>
          )}

          {/* LINK tab */}
          {tab === "link" && (
            <div className="space-y-2">
              <input
                type="url"
                placeholder="https://example.com"
                value={form.content}
                onChange={set("content")}
                className="w-full border border-gray-300 rounded px-3 py-2.5 text-sm outline-none focus:border-[#FF4500] placeholder-gray-400"
              />
              <p className="text-xs text-gray-400">
                Paste any link you want to share
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={onClose}
              className="border border-gray-300 text-gray-700 font-bold rounded-full px-5 py-2 text-sm hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading || !form.title || !form.community}
              className="bg-[#FF4500] hover:bg-[#e03d00] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-full px-5 py-2 text-sm transition-colors"
            >
              {loading ? "Posting..." : "Post"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
