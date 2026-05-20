import express from "express";
import {
  createCommunity,
  listCommunities,
  getCommunity,
  joinCommunity,
  leaveCommunity,
} from "../controllers/communityController.js";
import auth from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", listCommunities);
router.get("/:name", getCommunity);
router.post("/", auth, createCommunity);
router.post("/:name/join", auth, joinCommunity);
router.delete("/:name/leave", auth, leaveCommunity);

export default router;
