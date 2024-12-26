// File: /pages/api/connection/add.ts
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

  const { connectedTo } = req.body;

  if (!connectedTo) {
    return res.status(400).json({ error: "connectedTo ID is required" });
  }

  if (user.id === connectedTo) {
    return res.status(400).json({ error: "A user cannot connect to themselves" });
  }

  try {
    // Check if the connection already exists
    const existingConnection = await prisma.connection.findUnique({
      where: {
        userId_connectedTo: {
          userId: user.id,
          connectedTo,
        },
      },
    });

    if (existingConnection) {
      return res.status(409).json({ error: "Connection already exists" });
    }

    // Create the connection
    const connection = await prisma.connection.create({
      data: {
        userId: user.id,
        connectedTo,
      },
    });

    return res.status(201).json(connection);
  } catch (error) {
    console.error("Error creating connection:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

