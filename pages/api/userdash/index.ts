import type { NextApiRequest, NextApiResponse } from "next"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    const { session } = req.query

    try {
      let users
      if (session) {
        users = await prisma.user.findMany({
          where: {
            session: session as string,
          },
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
            session: true,
            isAdmin: true,
            joinDate: true,
          },
        })
      } else {
        users = await prisma.user.findMany({
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
            session: true,
            isAdmin: true,
            joinDate: true,
          },
        })
      }
      res.status(200).json(users)
    } catch (error) {
      console.error("Error fetching users:", error)
      res.status(500).json({ error: "Failed to fetch users" })
    }
  } else {
    res.setHeader("Allow", ["GET"])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}
