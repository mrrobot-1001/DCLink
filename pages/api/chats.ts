import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from ".prisma/client";
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
    // Fetch connected users for the logged-in user
    const connectedChats = await prisma.follow.findMany({
      where: { followerId: user.id },
      include: {
        following: {
          select: {
            id: true,
            username: true,
            bio: true,
          },
        },
      },
    });

    // Transform the data into a format suitable for the frontend
    const chats = connectedChats.map((connection) => ({
      id: connection.following.id,
      name: connection.following.username,
      avatar: "/default-avatar.svg", // Replace with dynamic avatars if available
      lastMessage: "Say hi to start a conversation!", // Placeholder last message
    }));

    res.status(200).json(chats);
  } catch (error) {
    console.error("Error fetching chats:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
