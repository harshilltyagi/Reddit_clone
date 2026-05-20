import express from "express";
import {
  createPost,
  listPosts,
  getPost,
} from "../controllers/postController.js";
import { votePost } from "../controllers/voteController.js";
import {
  addComment,
  getComments,
  deleteComment,
} from "../controllers/commentController.js";
import auth from "../middleware/authMiddleware.js";

const router = express.Router();

// Posts
router.get("/", listPosts);
router.get("/:id", getPost);
router.post("/", auth, createPost);

// Votes
router.post("/:id/vote", auth, votePost);

// Comments
router.get("/:id/comments", getComments);
router.post("/:id/comments", auth, addComment);
router.delete("/comments/:id", auth, deleteComment);

export default router;
