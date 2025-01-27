import type { NextApiRequest, NextApiResponse } from "next"
import { PrismaClient } from "@prisma/client"
import { getSession } from "next-auth/react"

const prisma = new PrismaClient()

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req })

  if (!session || !session.user) {
    return res.status(401).json({ message: "Unauthorized" })
  }

  if (req.method === "POST") {
    const { postId, parentId, content } = req.body
    const userId = session.user.id

    if (!userId) {
      return res.status(400).json({ message: "User ID is missing" })
    }

    try {
      const comment = await prisma.comment.create({
        data: {
          content,
          authorId: userId,
          postId,
          parentId,
        },
      })
      res.status(201).json(comment)
    } catch (error) {
      console.error("Error creating comment:", error)
      res.status(500).json({ message: "Failed to create comment" })
    }
  } else {
    res.setHeader("Allow", ["POST"])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}

