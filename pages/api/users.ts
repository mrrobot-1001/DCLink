import { NextApiRequest, NextApiResponse } from "next";
<<<<<<< HEAD
import { PrismaClient } from ".prisma/client";
=======
import { PrismaClient } from "@prisma/client";
>>>>>>> 0447a8f3363544cfe7947480e0d1a8819e94e7c7
import { authenticate } from "../../utils/authenticate";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  // Authenticate the user
  const user = authenticate(req);
  if (!user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    // Fetch all users from the database
    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        email: true,
        bio: true,
        location: true,
        website: true,
        followers: {
          select: {
            followerId: true,
          },
        },
        following: {
          select: {
            followingId: true,
          },
        },
      },
    });

    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
