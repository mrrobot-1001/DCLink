import type { NextApiRequest, NextApiResponse } from "next"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" })
  }

  try {
    const users = await prisma.user.findMany({
      select: {
        session: true,
      },
      where: {
        session: {
          not: null,
        },
      },
      distinct: ["session"],
    })

    const sessions = users
      .map((user) => user.session)
      .filter((session): session is string => session !== null)
      .sort()

    res.status(200).json(sessions)
  } catch (error) {
    console.error("Error fetching sessions:", error)
    res.status(500).json({ error: "Failed to fetch sessions" })
  }
}
