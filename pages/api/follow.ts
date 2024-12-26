// File: /pages/api/follow.ts
import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from ".prisma/client";
import { authenticate } from "../../utils/authenticate";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const user = authenticate(req);
  if (!user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const { followingId } = req.body;

  if (!followingId) {
    return res.status(400).json({ error: "Following ID is required" });
  }

  try {
    // Check if the relationship already exists
    const existingFollow = await prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId: user.id,
          followingId,
        },
      },
    });

    if (existingFollow) {
      return res.status(409).json({ error: "Already following this user" });
    }

    // Create a new follow relationship
    await prisma.follow.create({
      data: {
        followerId: user.id,
        followingId,
      },
    });

    return res.status(201).json({ message: "Followed successfully" });
  } catch (error) {
    console.error("Error creating follow relationship:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
