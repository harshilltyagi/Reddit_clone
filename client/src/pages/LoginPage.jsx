import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex">
      <div className="hidden lg:flex lg:w-[380px] bg-[#FF4500] flex-col justify-between p-10 flex-shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
            <span className="text-[#FF4500] font-bold text-sm">R</span>
          </div>
          <span className="text-white font-bold text-xl">reddit</span>
        </div>
        <div>
          <h1 className="text-white text-4xl font-bold leading-tight mb-4">
            The front page of the internet.
          </h1>
          <p className="text-orange-100 text-base leading-relaxed">
            Join thousands of communities. Dive into anything.
          </p>
        </div>
        <div className="text-orange-200 text-sm">
          © 2025 Reddit Inc. All rights reserved.
        </div>
      </div>
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-sm">
          <h2 className="text-2xl font-bold text-[#1c1c1c] mb-1">Log In</h2>
          <p className="text-sm text-gray-500 mb-6">
            By continuing, you agree to our{" "}
            <span className="text-[#FF4500] cursor-pointer hover:underline">
              User Agreement
            </span>{" "}
            and{" "}
            <span className="text-[#FF4500] cursor-pointer hover:underline">
              Privacy Policy
            </span>
            .
          </p>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg">
                {error}
              </div>
            )}
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-full px-4 py-2.5 text-sm outline-none focus:border-[#FF4500] focus:ring-1 focus:ring-[#FF4500] placeholder-gray-400"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-full px-4 py-2.5 text-sm outline-none focus:border-[#FF4500] focus:ring-1 focus:ring-[#FF4500] placeholder-gray-400"
            />
            <button
              type="submit"
              disabled={loading || !email || !password}
              className="w-full bg-[#FF4500] hover:bg-[#e03d00] disabled:opacity-50 text-white font-bold rounded-full py-2.5 text-sm transition-colors"
            >
              {loading ? "Logging in..." : "Log In"}
            </button>
          </form>
          <p className="text-center text-sm text-gray-500 mt-6">
            New to Reddit?{" "}
            <Link
              to="/signup"
              className="text-[#FF4500] font-semibold hover:underline"
            >
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
