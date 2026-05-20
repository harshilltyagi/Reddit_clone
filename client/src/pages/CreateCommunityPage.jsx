import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../lib/api";
import { useAuth } from "../context/AuthContext";

export default function CreateCommunityPage() {
  const [form, setForm] = useState({ name: "", slug: "", description: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  const set = (k) => (e) => {
    const val = e.target.value;
    setForm((f) => ({
      ...f,
      [k]: val,
      ...(k === "name"
        ? {
            slug: val
              .toLowerCase()
              .replace(/\s+/g, "_")
              .replace(/[^a-z0-9_]/g, ""),
          }
        : {}),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const data = await api.createCommunity(form);
      navigate(`/r/${data.slug}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Create a Community</h1>
        <p className="text-sm text-gray-500 mt-1">
          Build a home for your interests. Add what's on your mind.
        </p>
      </div>

      <div className="bg-white border border-gray-300 rounded-sm p-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name */}
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-1">
              Community Name
            </label>
            <p className="text-xs text-gray-500 mb-2">
              Community names cannot be changed after creation.
            </p>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm font-medium">
                r/
              </span>
              <input
                type="text"
                value={form.name}
                onChange={set("name")}
                required
                maxLength={21}
                placeholder="communityname"
                className="w-full border border-gray-300 rounded pl-8 pr-3 py-2.5 text-sm outline-none focus:border-[#FF4500] focus:ring-1 focus:ring-[#FF4500]"
              />
            </div>
            <p className="text-xs text-gray-400 mt-1">
              {21 - form.name.length} characters remaining
            </p>
          </div>

          {/* Slug — auto generated */}
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-1">
              Slug{" "}
              <span className="text-gray-400 font-normal">
                (auto-generated from name)
              </span>
            </label>
            <input
              type="text"
              value={form.slug}
              onChange={set("slug")}
              required
              placeholder="community_slug"
              className="w-full border border-gray-300 rounded px-3 py-2.5 text-sm outline-none focus:border-[#FF4500] focus:ring-1 focus:ring-[#FF4500] bg-gray-50"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-1">
              Description{" "}
              <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <p className="text-xs text-gray-500 mb-2">
              This is how new members come to understand your community.
            </p>
            <textarea
              value={form.description}
              onChange={set("description")}
              rows={4}
              maxLength={500}
              placeholder="Tell people what your community is about..."
              className="w-full border border-gray-300 rounded px-3 py-2.5 text-sm outline-none focus:border-[#FF4500] focus:ring-1 focus:ring-[#FF4500] resize-none"
            />
            <p className="text-xs text-gray-400 mt-1 text-right">
              {500 - form.description.length} characters remaining
            </p>
          </div>

          {/* Community Type */}
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-2">
              Community Type
            </label>
            <div className="space-y-2">
              {[
                [
                  "public",
                  "🌐",
                  "Public",
                  "Anyone can view, post, and comment",
                ],
                [
                  "restricted",
                  "🔒",
                  "Restricted",
                  "Anyone can view, but only approved users can post",
                ],
                [
                  "private",
                  "🔐",
                  "Private",
                  "Only approved users can view and submit",
                ],
              ].map(([val, icon, label, desc]) => (
                <label
                  key={val}
                  className="flex items-start gap-3 cursor-pointer p-2 rounded hover:bg-gray-50"
                >
                  <input
                    type="radio"
                    name="type"
                    value={val}
                    defaultChecked={val === "public"}
                    className="mt-0.5 accent-[#FF4500]"
                  />
                  <div>
                    <div className="text-sm font-medium">
                      {icon} {label}
                    </div>
                    <div className="text-xs text-gray-500">{desc}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={() => navigate("/")}
              className="border border-gray-300 text-gray-700 font-bold rounded-full px-5 py-2 text-sm hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !form.name || !form.slug}
              className="bg-[#FF4500] hover:bg-[#e03d00] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-full px-5 py-2 text-sm transition-colors"
            >
              {loading ? "Creating..." : "Create Community"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
