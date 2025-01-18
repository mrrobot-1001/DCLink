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
    const connection = await prisma.connection.create({
      data: {
        userId: user.id,
        connectedTo: userId,
      },
    });

    // Create a new chat for the connected users
    const chat = await prisma.chat.create({
      data: {
        participants: {
          create: [
            { userId: user.id },
            { userId: userId },
          ],
        },
      },
    });

    res.status(200).json({ connection, chat });
  } catch (error) {
    console.error("Error connecting users:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

