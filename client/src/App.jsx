import { Routes, Route } from "react-router-dom";
import { useState } from "react";
import Navbar from "./components/Navbar";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import HomePage from "./pages/HomePage";
import ProfilePage from "./pages/ProfilePage";
import CommunityPage from "./pages/CommunityPage";
import CreateCommunityPage from "./pages/CreateCommunityPage";
import PostDetailPage from "./pages/PostDetailPage";
import CreatePostModal from "./components/CreatePostModal";

export default function App() {
  const [showCreate, setShowCreate] = useState(false);

  return (
    <div className="min-h-screen bg-[#DAE0E6]">
      {showCreate && <CreatePostModal onClose={() => setShowCreate(false)} />}
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route
          path="/*"
          element={
            <>
              <Navbar onCreatePost={() => setShowCreate(true)} />
              <div className="pt-12">
                <Routes>
                  <Route
                    path="/"
                    element={
                      <HomePage onCreatePost={() => setShowCreate(true)} />
                    }
                  />
                  <Route
                    path="/r/:slug"
                    element={
                      <CommunityPage onCreatePost={() => setShowCreate(true)} />
                    }
                  />
                  <Route
                    path="/r/:slug/comments/:id"
                    element={<PostDetailPage />}
                  />
                  <Route
                    path="/create-community"
                    element={<CreateCommunityPage />}
                  />
                  <Route path="/profile" element={<ProfilePage />} />
                </Routes>
              </div>
            </>
          }
        />
      </Routes>
    </div>
  );
}
