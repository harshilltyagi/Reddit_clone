import config from "./config";

const getToken = () => localStorage.getItem(config.TOKEN_KEY);

const req = async (path, options = {}) => {
  const token = getToken();
  const res = await fetch(`${config.BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });
  const data = await res.json();
  if (!res.ok)
    throw new Error(data.error || data.message || "Something went wrong");
  return data;
};

export const api = {
  // Auth
  login: (body) =>
    req("/auth/login", { method: "POST", body: JSON.stringify(body) }),
  register: (body) =>
    req("/auth/signup", { method: "POST", body: JSON.stringify(body) }), // ✅ /signup

  // Communities
  getCommunities: () => req("/communities"),
  getCommunity: (slug) => req(`/communities/${slug}`),
  createCommunity: (body) =>
    req("/communities", { method: "POST", body: JSON.stringify(body) }),
  joinCommunity: (slug) => req(`/communities/${slug}/join`, { method: "POST" }),
  leaveCommunity: (slug) =>
    req(`/communities/${slug}/leave`, { method: "DELETE" }),

  // Posts
  getPosts: (params = {}) => req(`/posts?${new URLSearchParams(params)}`),
  getPost: (id) => req(`/posts/${id}`),
  createPost: (body) =>
    req("/posts", { method: "POST", body: JSON.stringify(body) }),

  // Votes
  vote: (postId, type) =>
    req(`/posts/${postId}/vote`, {
      method: "POST",
      body: JSON.stringify({ type }),
    }),

  // Comments
  getComments: (postId) => req(`/posts/${postId}/comments`),
  addComment: (postId, content) =>
    req(`/posts/${postId}/comments`, {
      method: "POST",
      body: JSON.stringify({ content }),
    }),
  deleteComment: (commentId) =>
    req(`/posts/comments/${commentId}`, { method: "DELETE" }),
};
