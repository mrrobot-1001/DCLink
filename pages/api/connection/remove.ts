// File: /pages/api/connection/remove.ts
import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { authenticate } from "../../../utils/authenticate";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "DELETE") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const user = authenticate(req);
  if (!user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const { connectedTo } = req.body;

  if (!connectedTo) {
    return res.status(400).json({ error: "connectedTo ID is required" });
  }

  try {
    // Check if the connection exists
    const existingConnection = await prisma.connection.findUnique({
      where: {
        userId_connectedTo: {
          userId: user.id,
          connectedTo,
        },
      },
    });

    if (!existingConnection) {
      return res.status(404).json({ error: "Connection not found" });
    }

    // Remove the connection
    await prisma.connection.delete({
      where: {
        userId_connectedTo: {
          userId: user.id,
          connectedTo,
        },
      },
    });

    return res.status(200).json({ message: "Disconnected successfully" });
  } catch (error) {
    console.error("Error removing connection:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

