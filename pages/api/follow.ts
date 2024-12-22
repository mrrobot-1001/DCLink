import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "POST") {
    const { followerId, followingId } = req.body;

    if (!followerId || !followingId) {
      return res
        .status(400)
        .json({ error: "Both followerId and followingId are required." });
    }

    if (followerId === followingId) {
      return res
        .status(400)
        .json({ error: "A user cannot follow themselves." });
    }

    try {
      // Check if the follow relationship already exists
      const existingFollow = await prisma.follower.findFirst({
        where: { followerId, followingId },
      });

      if (existingFollow) {
        return res
          .status(400)
          .json({ error: "You are already following this user." });
      }

      // Create the follow relationship
      await prisma.follower.create({
        data: { followerId, followingId },
      });

      res.status(200).json({ message: "Followed successfully." });
    } catch (err) {
      console.error("Error following user:", err);
      res.status(500).json({ error: "Internal server error." });
    }
  } else {
    res.status(405).json({ error: "Method not allowed." });
  }
}
