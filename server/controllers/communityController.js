import prisma from "../utils/prismaClient.js";
export const createCommunity = async (req, res) => {
  const { name, slug, description } = req.body;
  const userId = req.user.id;

  if (!name || !slug)
    return res.status(400).json({ error: "Community name is required" });

  try {
    const existing = await prisma.community.findUnique({ where: { name } });
    if (existing)
      return res.status(409).json({ error: "Community name already taken" });

    const community = await prisma.community.create({
      data: {
        name,
        slug,
        description,
        creatorId: userId,
        members: {
          create: { userId, role: "ADMIN" },
        },
      },
      include: {
        creator: { select: { id: true, username: true } },
        _count: { select: { members: true } },
      },
    });

    res.status(201).json(community);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const listCommunities = async (req, res) => {
  const { page = 1, limit = 20, search = "" } = req.query;
  const skip = (parseInt(page) - 1) * parseInt(limit);

  try {
    const [communities, total] = await Promise.all([
      prisma.community.findMany({
        where: search
          ? { name: { contains: search, mode: "insensitive" } }
          : {},
        skip,
        take: parseInt(limit),
        orderBy: { members: { _count: "desc" } },
        include: {
          creator: { select: { id: true, username: true } },
          _count: { select: { members: true, posts: true } },
        },
      }),
      prisma.community.count({
        where: search
          ? { name: { contains: search, mode: "insensitive" } }
          : {},
      }),
    ]);

    res.json({
      communities,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getCommunity = async (req, res) => {
  const { name } = req.params;
  try {
    const community = await prisma.community.findUnique({
      where: { name },
      include: {
        creator: { select: { id: true, username: true } },
        _count: { select: { members: true, posts: true } },
      },
    });
    if (!community)
      return res.status(404).json({ error: "Community not found" });
    res.json(community);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const joinCommunity = async (req, res) => {
  const { name } = req.params;
  const userId = req.user.id;
  try {
    const community = await prisma.community.findUnique({ where: { name } });
    if (!community)
      return res.status(404).json({ error: "Community not found" });

    const member = await prisma.communityMember.create({
      data: { userId, communityId: community.id },
    });
    res.status(201).json({ message: "Joined successfully", member });
  } catch (err) {
    if (err.code === "P2002")
      return res.status(409).json({ error: "Already a member" });
    res.status(500).json({ error: err.message });
  }
};

export const leaveCommunity = async (req, res) => {
  const { name } = req.params;
  const userId = req.user.id;
  try {
    const community = await prisma.community.findUnique({ where: { name } });
    if (!community)
      return res.status(404).json({ error: "Community not found" });

    await prisma.communityMember.delete({
      where: { userId_communityId: { userId, communityId: community.id } },
    });
    res.json({ message: "Left community" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
