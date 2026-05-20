import prisma from "../utils/prismaClient.js";

export const createPost = async (req, res) => {
  const { title, content, imageUrl, communitySlug, type } = req.body;
  const authorId = req.user.id;

  if (!title || !communitySlug)
    return res.status(400).json({ error: "Title and community are required" });

  try {
    const community = await prisma.community.findUnique({
      where: { slug: communitySlug },
    });
    if (!community)
      return res.status(404).json({ error: "Community not found" });

    const post = await prisma.post.create({
      data: {
        title,
        content: content || null,
        imageUrl: imageUrl || null,
        type: type || "text",
        authorId,
        communityId: community.id,
      },
      include: {
        author: { select: { id: true, username: true } },
        community: { select: { id: true, name: true, slug: true } },
        _count: { select: { votes: true, comments: true } },
        votes: true,
      },
    });

    const upvotes = post.votes.filter((v) => v.type === "UPVOTE").length;
    const downvotes = post.votes.filter((v) => v.type === "DOWNVOTE").length;

    res
      .status(201)
      .json({ ...post, upvotes, downvotes, score: upvotes - downvotes });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const listPosts = async (req, res) => {
  const { page = 1, limit = 20, sort = "latest", communitySlug } = req.query;
  const skip = (parseInt(page) - 1) * parseInt(limit);

  const where = communitySlug ? { community: { slug: communitySlug } } : {};
  const orderBy =
    sort === "popular" ? { votes: { _count: "desc" } } : { createdAt: "desc" };

  try {
    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where,
        skip,
        take: parseInt(limit),
        orderBy,
        include: {
          author: { select: { id: true, username: true } },
          community: { select: { id: true, name: true, slug: true } },
          _count: { select: { votes: true, comments: true } },
          votes: true, // ✅ include full votes array
        },
      }),
      prisma.post.count({ where }),
    ]);

    // ✅ Calculate upvotes/downvotes/score for each post
    const postsWithScore = posts.map((post) => {
      const upvotes = post.votes.filter((v) => v.type === "UPVOTE").length;
      const downvotes = post.votes.filter((v) => v.type === "DOWNVOTE").length;
      return {
        ...post,
        upvotes,
        downvotes,
        score: upvotes - downvotes,
      };
    });

    res.json({
      posts: postsWithScore,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getPost = async (req, res) => {
  const { id } = req.params;
  try {
    const post = await prisma.post.findUnique({
      where: { id: parseInt(id) },
      include: {
        author: { select: { id: true, username: true } },
        community: { select: { id: true, name: true, slug: true } },
        comments: {
          orderBy: { createdAt: "desc" },
          include: { author: { select: { id: true, username: true } } },
        },
        votes: true,
        _count: { select: { votes: true, comments: true } },
      },
    });

    if (!post) return res.status(404).json({ error: "Post not found" });

    // ✅ Calculate score
    const upvotes = post.votes.filter((v) => v.type === "UPVOTE").length;
    const downvotes = post.votes.filter((v) => v.type === "DOWNVOTE").length;

    res.json({ ...post, upvotes, downvotes, score: upvotes - downvotes });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
