// File: /pages/api/unfollow.ts
import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from ".prisma/client";
import { authenticate } from "../../utils/authenticate";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "DELETE") {
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
    // Check if the relationship exists
    const existingFollow = await prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId: user.id,
          followingId,
        },
      },
    });

    if (!existingFollow) {
      return res.status(404).json({ error: "Follow relationship not found" });
    }

    // Delete the follow relationship
    await prisma.follow.delete({
      where: {
        id: existingFollow.id,
      },
    });

    return res.status(200).json({ message: "Unfollowed successfully" });
  } catch (error) {
    console.error("Error deleting follow relationship:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
