import prisma from "../utils/prismaClient.js";

export const createPost = async (req, res) => {
  const { title, content, imageUrl, communitySlug, type } = req.body;
  const authorId = req.user.id;

  if (!title || !communitySlug) {
    return res.status(400).json({ error: "Title and community are required" });
  }

  try {
    const community = await prisma.community.findUnique({
      where: { slug: communitySlug },
    });
    if (!community)
      return res.status(404).json({ error: "Community not found" });

    const post = await prisma.post.create({
      data: {
        title,
        content,
        imageUrl: imageUrl || null,
        type: type || "text", // 'text' | 'image' | 'link'
        authorId,
        communityId: community.id,
      },
      include: {
        author: { select: { id: true, username: true } },
        community: { select: { id: true, name: true, slug: true } },
        _count: { select: { votes: true, comments: true } },
      },
    });

    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const listPosts = async (req, res) => {
  const { sort = "latest", communitySlug, page = 1, limit = 10 } = req.query;
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
        },
      }),
      prisma.post.count({ where }),
    ]);

    res.json({
      posts,
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

    // Calculate vote score
    const upvotes = post.votes.filter((v) => v.type === "UPVOTE").length;
    const downvotes = post.votes.filter((v) => v.type === "DOWNVOTE").length;

    res.json({ ...post, score: upvotes - downvotes, upvotes, downvotes });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
