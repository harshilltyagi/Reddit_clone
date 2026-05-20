import prisma from "../utils/prismaClient.js";

export const addComment = async (req, res) => {
  const { id } = req.params;
  const { content } = req.body;
  const authorId = req.user.id;

  if (!content) return res.status(400).json({ error: "Content is required" });

  try {
    const post = await prisma.post.findUnique({ where: { id: parseInt(id) } });
    if (!post) return res.status(404).json({ error: "Post not found" });

    const comment = await prisma.comment.create({
      data: { content, authorId, postId: parseInt(id) },
      include: { author: { select: { id: true, username: true } } },
    });

    res.status(201).json(comment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getComments = async (req, res) => {
  const { id } = req.params;
  try {
    const comments = await prisma.comment.findMany({
      where: { postId: parseInt(id) },
      orderBy: { createdAt: "desc" },
      include: { author: { select: { id: true, username: true } } },
    });

    res.json(comments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteComment = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    const comment = await prisma.comment.findUnique({
      where: { id: parseInt(id) },
    });
    if (!comment) return res.status(404).json({ error: "Comment not found" });
    if (comment.authorId !== userId)
      return res.status(403).json({ error: "Not your comment" });

    await prisma.comment.delete({ where: { id: parseInt(id) } });
    res.json({ message: "Comment deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
