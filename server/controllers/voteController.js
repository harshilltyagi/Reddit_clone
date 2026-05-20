import prisma from "../utils/prismaClient.js";

// POST /api/posts/:id/vote
export const votePost = async (req, res) => {
  const { id } = req.params;
  const { type } = req.body; // 'UPVOTE' or 'DOWNVOTE'
  const userId = req.user.id;

  if (!["UPVOTE", "DOWNVOTE"].includes(type)) {
    return res
      .status(400)
      .json({ error: "Vote type must be UPVOTE or DOWNVOTE" });
  }

  try {
    const post = await prisma.post.findUnique({ where: { id: parseInt(id) } });
    if (!post) return res.status(404).json({ error: "Post not found" });

    const existing = await prisma.vote.findUnique({
      where: { userId_postId: { userId, postId: parseInt(id) } },
    });

    let action;

    if (existing) {
      if (existing.type === type) {
        // Same vote → remove it (toggle off)
        await prisma.vote.delete({ where: { id: existing.id } });
        action = "removed";
      } else {
        // Different vote → switch it
        await prisma.vote.update({
          where: { id: existing.id },
          data: { type },
        });
        action = "switched";
      }
    } else {
      // No existing vote → create
      await prisma.vote.create({
        data: { type, userId, postId: parseInt(id) },
      });
      action = "added";
    }

    // Return updated score
    const votes = await prisma.vote.findMany({
      where: { postId: parseInt(id) },
    });
    const upvotes = votes.filter((v) => v.type === "UPVOTE").length;
    const downvotes = votes.filter((v) => v.type === "DOWNVOTE").length;

    res.json({ action, score: upvotes - downvotes, upvotes, downvotes });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
