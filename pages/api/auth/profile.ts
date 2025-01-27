import type { NextApiRequest, NextApiResponse } from "next"
import { PrismaClient } from "@prisma/client"

import { authenticate } from "../../../utils/authenticate"

const prisma = new PrismaClient()

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method Not Allowed" })
  }

  // Authenticate the user using JWT
  const user = authenticate(req)
  if (!user) {
    return res.status(401).json({ error: "Unauthorized" })
  }

  try {
    // Fetch the current logged-in user's details from the database
    const currentUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        username: true,
        email: true,
        bio: true,
        location: true,
        website: true,
        instagramProfile: true,
        githubProfile: true,
        linkedinProfile: true,
        skills: true,
        currentlyWorkingAt: true,
        pastWorkedAt: true,
        joinDate: true,
        session: true,
        isAdmin: true,
        connections: {
          select: {
            id: true,
          },
        },
      },
    })

    if (!currentUser) {
      return res.status(404).json({ error: "User not found" })
    }

    // Return the user's profile details including the number of connections
    return res.status(200).json({
      ...currentUser,
      connectionCount: currentUser.connections.length,
    })
  } catch (error) {
    console.error("Error fetching user profile:", error)
    return res.status(500).json({ error: "Internal Server Error" })
  }
}

