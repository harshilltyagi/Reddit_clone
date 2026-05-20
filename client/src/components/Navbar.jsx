import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar({ onCreatePost }) {
  const { user, logout, isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 h-12 flex items-center px-4 gap-2">
      <Link to="/" className="flex items-center gap-1.5 shrink-0 mr-2">
        <div className="w-8 h-8 bg-[#FF4500] rounded-full flex items-center justify-center">
          <span className="text-white font-bold text-sm">R</span>
        </div>
        <span className="font-bold text-lg text-[#1c1c1c] hidden sm:block">
          reddit
        </span>
      </Link>

      <div className="flex-1 max-w-xl">
        <div className="flex items-center gap-2 bg-gray-100 hover:bg-white hover:border-[#FF4500] border border-transparent rounded-full px-4 py-1.5 transition-colors cursor-text">
          <svg
            className="w-4 h-4 text-gray-400 shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            className="bg-transparent outline-none text-sm text-gray-700 placeholder-gray-400 w-full"
            placeholder="Search Reddit"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 ml-auto shrink-0">
        {isLoggedIn ? (
          <>
            <Link
              to="/create-community"
              className="hidden sm:flex items-center gap-1.5 border border-gray-300 rounded-full px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
            >
              + Create Community
            </Link>
            <button
              onClick={onCreatePost}
              className="hidden sm:flex items-center gap-1.5 border border-gray-300 rounded-full px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
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
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Create Post
            </button>
            <div className="relative">
              <div
                className="flex items-center gap-1 border border-gray-200 rounded-full px-2 py-1 cursor-pointer hover:border-[#FF4500] transition-colors"
                onClick={() => setShowMenu((m) => !m)}
              >
                <div className="w-7 h-7 rounded-full bg-[#FF4500] flex items-center justify-center text-white font-bold text-xs">
                  {user?.username?.[0]?.toUpperCase()}
                </div>
                <span className="text-xs font-medium text-gray-700 hidden md:block px-1">
                  {user?.username}
                </span>
                <svg
                  className="w-3 h-3 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
              {showMenu && (
                <div className="absolute right-0 top-10 bg-white border border-gray-200 rounded-lg shadow-lg w-44 py-1 z-50">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-xs font-bold text-gray-900">
                      {user?.username}
                    </p>
                    <p className="text-xs text-gray-500">{user?.email}</p>
                  </div>
                  {/* ✅ Profile link added */}
                  <button
                    onClick={() => {
                      navigate("/profile");
                      setShowMenu(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    👤 My Profile
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    Log Out
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="border border-[#FF4500] text-[#FF4500] font-bold rounded-full px-4 py-1.5 text-sm hover:bg-orange-50 transition-colors"
            >
              Log In
            </Link>
            <Link
              to="/signup"
              className="bg-[#FF4500] text-white font-bold rounded-full px-4 py-1.5 text-sm hover:bg-[#e03d00] transition-colors"
            >
              Sign Up
            </Link>
          </>
        )}
      </div>
    </header>
  );
}
