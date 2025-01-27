import type { NextApiRequest, NextApiResponse } from "next"
import { PrismaClient } from "@prisma/client"
import { authenticate } from "../../../../utils/authenticate"

const prisma = new PrismaClient()

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const user = authenticate(req)
    if (!user) {
      return res.status(401).json({ error: "Unauthorized" })
    }

    const { postId } = req.query
    const { content } = req.body

    try {
      const comment = await prisma.comment.create({
        data: {
          content,
          authorId: user.id,
          postId: Number.parseInt(postId as string),
        },
      })

      res.status(201).json(comment)
    } catch (error) {
      console.error("Error creating comment:", error)
      res.status(500).json({ error: "Failed to create comment" })
    }
  } else {
    res.setHeader("Allow", ["POST"])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}

