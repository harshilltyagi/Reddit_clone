import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function SignupPage() {
  const [form, setForm] = useState({ email: "", username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { register } = useAuth();
  const navigate = useNavigate();

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await register(form);
      navigate("/login");
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
            Dive into anything.
          </h1>
          <ul className="space-y-3 text-orange-100 text-sm">
            {[
              "🔥 Join 100,000+ communities",
              "💬 Comment, vote, discuss",
              "🚀 Share what you love",
              "🌐 Explore trending topics",
            ].map((i) => (
              <li key={i}>{i}</li>
            ))}
          </ul>
        </div>
        <div className="text-orange-200 text-sm">© 2025 Reddit Inc.</div>
      </div>
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-sm">
          <h2 className="text-2xl font-bold text-[#1c1c1c] mb-1">Sign Up</h2>
          <p className="text-sm text-gray-500 mb-6">
            By continuing, you agree to our{" "}
            <span className="text-[#FF4500] cursor-pointer hover:underline">
              User Agreement
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
              value={form.email}
              onChange={set("email")}
              required
              className="w-full border border-gray-300 rounded-full px-4 py-2.5 text-sm outline-none focus:border-[#FF4500] focus:ring-1 focus:ring-[#FF4500] placeholder-gray-400"
            />
            <input
              type="text"
              placeholder="Username"
              value={form.username}
              onChange={set("username")}
              required
              className="w-full border border-gray-300 rounded-full px-4 py-2.5 text-sm outline-none focus:border-[#FF4500] focus:ring-1 focus:ring-[#FF4500] placeholder-gray-400"
            />
            <input
              type="password"
              placeholder="Password (min 8 chars)"
              value={form.password}
              onChange={set("password")}
              required
              minLength={8}
              className="w-full border border-gray-300 rounded-full px-4 py-2.5 text-sm outline-none focus:border-[#FF4500] focus:ring-1 focus:ring-[#FF4500] placeholder-gray-400"
            />
            <button
              type="submit"
              disabled={
                loading || !form.email || !form.username || !form.password
              }
              className="w-full bg-[#FF4500] hover:bg-[#e03d00] disabled:opacity-50 text-white font-bold rounded-full py-2.5 text-sm transition-colors"
            >
              {loading ? "Creating account..." : "Continue"}
            </button>
          </form>
          <p className="text-center text-sm text-gray-500 mt-6">
            Already a redditor?{" "}
            <Link
              to="/login"
              className="text-[#FF4500] font-semibold hover:underline"
            >
              Log In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
