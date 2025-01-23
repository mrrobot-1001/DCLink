import type { NextApiRequest, NextApiResponse } from "next"
import { PrismaClient } from "@prisma/client"

import { authenticate } from "../../../utils/authenticate"

const prisma = new PrismaClient()

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "PUT") {
    return res.status(405).json({ error: "Method Not Allowed" })
  }

  // Authenticate the user using JWT
  const user = authenticate(req)
  if (!user) {
    return res.status(401).json({ error: "Unauthorized" })
  }

  try {
    const {
      bio,
      location,
      website,
      instagramProfile,
      githubProfile,
      linkedinProfile,
      skills,
      currentlyWorkingAt,
      pastWorkedAt,
      session,
    } = req.body

    // Update the user's profile in the database
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        bio,
        location,
        website,
        instagramProfile,
        githubProfile,
        linkedinProfile,
        skills,
        currentlyWorkingAt,
        pastWorkedAt,
        session,
      },
    })

    // Return the updated user profile
    return res.status(200).json({
      ...updatedUser,
      connectionCount: updatedUser.connections.length,
    })
  } catch (error) {
    console.error("Error updating user profile:", error)
    return res.status(500).json({ error: "Internal Server Error" })
  }
}

