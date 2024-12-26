// File: /pages/api/connection/list.ts
import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { authenticate } from "../../../utils/authenticate";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const user = authenticate(req);
  if (!user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    // Fetch all connections for the logged-in user
    const connections = await prisma.connection.findMany({
      where: {
        userId: user.id,
      },
      include: {
        connected: true, // Includes the connected user's details
      },
    });

    return res.status(200).json(connections);
  } catch (error) {
    console.error("Error fetching connections:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
