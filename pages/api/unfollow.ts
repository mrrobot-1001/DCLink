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
      return res.status(400).json({ error: "A user cannot unfollow themselves." });
    }

    try {
      // Check if the follow relationship exists
      const existingFollow = await prisma.follow.findFirst({
        where: { followerId: user.id, followingId },
      });

      if (!existingFollow) {
        return res.status(404).json({ error: "Follow relationship not found." });
      }

      // Delete the follow relationship
      await prisma.follow.delete({
        where: {
          id: existingFollow.id,
        },
      });

      return res.status(200).json({ message: "Successfully unfollowed the user." });
    } catch (error) {
      console.error("Error deleting follow:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    return res.status(405).json({ error: "Method Not Allowed" });
  }
}

