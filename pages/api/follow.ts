import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from ".prisma/client";
import { authenticate } from "../../utils/authenticate";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const user = authenticate(req);
    if (!user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { followingId } = req.body;

    if (!followingId) {
      return res.status(400).json({ error: "Following ID is required." });
    }

    if (user.id === followingId) {
      return res.status(400).json({ error: "A user cannot follow themselves." });
    }

    try {
      // Check if the follow relationship already exists
      const existingFollow = await prisma.follow.findFirst({
        where: { followerId: user.id, followingId },
      });

      if (existingFollow) {
        return res.status(409).json({ error: "Already following this user." });
      }

      // Create the follow relationship
      const follow = await prisma.follow.create({
        data: {
          followerId: user.id,
          followingId,
        },
      });

      return res.status(201).json(follow);
    } catch (error) {
      console.error("Error creating follow:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    return res.status(405).json({ error: "Method Not Allowed" });
  }
}
