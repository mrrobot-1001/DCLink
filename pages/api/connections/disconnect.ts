import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { authenticate } from "../../../utils/authenticate";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const user = authenticate(req);
  if (!user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ error: "Missing userId in request body" });
  }

  try {
    // Delete the connection in both directions
    await prisma.connection.deleteMany({
      where: {
        OR: [
          { userId: user.id, connectedTo: userId },
          { userId: userId, connectedTo: user.id },
        ],
      },
    });

    // Find and delete the chat between these users
    const chat = await prisma.chat.findFirst({
      where: {
        participants: {
          every: {
            userId: {
              in: [user.id, userId],
            },
          },
        },
      },
    });

    if (chat) {
      await prisma.message.deleteMany({
        where: { chatId: chat.id },
      });

      await prisma.userChat.deleteMany({
        where: { chatId: chat.id },
      });

      await prisma.chat.delete({
        where: { id: chat.id },
      });
    }

    res.status(200).json({ message: "Users disconnected successfully" });
  } catch (error) {
    console.error("Error disconnecting users:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

