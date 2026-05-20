import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../lib/api";

export default function Sidebar({ communityInfo }) {
  const [communities, setCommunities] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    api
      .getCommunities()
      .then((d) => setCommunities(d.communities ?? []))
      .catch(console.error);
  }, []);

  const fmt = (n) => (n >= 1000 ? (n / 1000).toFixed(1) + "k" : n);

  return (
    <div className="space-y-4">
      {/* Community about — shown on community page */}
      {communityInfo && (
        <div className="bg-white border border-gray-300 rounded-sm overflow-hidden">
          <div className="bg-[#FF4500] h-8" />
          <div className="p-3">
            <h2 className="font-bold text-sm mb-2">
              About r/{communityInfo.name}
            </h2>
            {communityInfo.description && (
              <p className="text-sm text-gray-600 mb-3">
                {communityInfo.description}
              </p>
            )}
            <div className="flex gap-4 mb-3">
              <div>
                <div className="font-bold text-sm">
                  {communityInfo.memberCount ?? "—"}
                </div>
                <div className="text-xs text-gray-500">Members</div>
              </div>
              <div>
                <div className="font-bold text-sm text-green-600">● Online</div>
                <div className="text-xs text-gray-500">Active now</div>
              </div>
            </div>
            <button className="w-full bg-[#FF4500] hover:bg-[#e03d00] text-white font-bold rounded-full py-1.5 text-sm transition-colors">
              Join
            </button>
          </div>
        </div>
      )}

      {/* Top Communities — from real API */}
      <div className="bg-white border border-gray-300 rounded-sm p-3">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-bold text-sm">Top Communities</h2>
          <button
            onClick={() => navigate("/create-community")}
            className="text-xs text-[#FF4500] font-semibold hover:underline"
          >
            + Create
          </button>
        </div>

        {communities.length === 0 ? (
          <div className="text-center py-4">
            <p className="text-xs text-gray-500 mb-2">No communities yet</p>
            <button
              onClick={() => navigate("/create-community")}
              className="text-xs text-[#FF4500] font-semibold hover:underline"
            >
              Create the first one!
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            {communities.slice(0, 5).map((c, i) => (
              <div
                key={c.id}
                className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 rounded p-1 -mx-1 transition-colors"
                onClick={() => navigate(`/r/${c.slug}`)}
              >
                <span className="text-gray-500 text-xs font-bold w-4">
                  {i + 1}
                </span>
                <div className="w-7 h-7 rounded-full bg-[#FF4500] flex items-center justify-center text-white text-xs font-bold shrink-0">
                  {c.name[0].toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-medium truncate">r/{c.name}</div>
                  <div className="text-xs text-gray-400">
                    {fmt(c._count?.members ?? 0)} members
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {communities.length > 5 && (
          <button
            onClick={() => navigate("/communities")}
            className="mt-3 w-full text-center text-xs text-[#0079D3] hover:underline font-medium"
          >
            View All →
          </button>
        )}
      </div>

      {/* Reddit Rules */}
      <div className="bg-white border border-gray-300 rounded-sm p-3">
        <h2 className="font-bold text-sm mb-3">Reddit Rules</h2>
        <ol className="space-y-2">
          {[
            "Remember the human",
            "Behave like you would in real life",
            "Look for the original source",
            "Search before posting",
            "Read community rules",
          ].map((rule, i) => (
            <li key={i} className="flex gap-2 text-xs text-gray-600">
              <span className="font-bold text-gray-900 shrink-0">{i + 1}.</span>
              {rule}
            </li>
          ))}
        </ol>
      </div>

      <p className="text-xs text-gray-400 px-1">
        Reddit Inc © 2025. All rights reserved.
      </p>
    </div>
  );
}
