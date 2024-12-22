import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "DELETE") {
    const { followerId, followingId } = req.body;

    if (!followerId || !followingId) {
      return res
        .status(400)
        .json({ error: "Both followerId and followingId are required." });
    }

    try {
      // Check if the follow relationship exists
      const existingFollow = await prisma.follower.findFirst({
        where: { followerId, followingId },
      });

      if (!existingFollow) {
        return res
          .status(404)
          .json({ error: "Follow relationship does not exist." });
      }

      // Delete the follow relationship
      await prisma.follower.delete({
        where: { id: existingFollow.id },
      });

      res.status(200).json({ message: "Unfollowed successfully." });
    } catch (err) {
      console.error("Error unfollowing user:", err);
      res.status(500).json({ error: "Internal server error." });
    }
  } else {
    res.status(405).json({ error: "Method not allowed." });
  }
}
