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
    // Fetch all users with their connection status
    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        email: true,
        bio: true,
        location: true,
        website: true,
        connections: {
          where: { connectedTo: user.id }, // Check if this user is connected to the logged-in user
          select: {
            id: true,
          },
        },
        connectedBy: {
          where: { userId: user.id }, // Check if the logged-in user is connected to this user
          select: {
            id: true,
          },
        },
      },
    });

    // Map users and determine the `isConnected` field
    const formattedUsers = users.map((u) => ({
      id: u.id,
      username: u.username,
      email: u.email,
      bio: u.bio,
      location: u.location,
      website: u.website,
      isConnected: u.connectedBy.length > 0 || u.connections.length > 0, // True if there is any connection
    }));

    res.status(200).json(formattedUsers);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
