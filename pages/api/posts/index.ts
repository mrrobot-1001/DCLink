import type { NextApiRequest, NextApiResponse } from "next"
import { PrismaClient } from "@prisma/client"
import { getSession } from "next-auth/react"

const prisma = new PrismaClient()

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req })

  if (!session || !session.user) {
    return res.status(401).json({ message: "Unauthorized" })
  }

  if (req.method === "GET") {
    try {
      const posts = await prisma.post.findMany({
        include: {
          author: {
            select: { id: true, username: true, avatar: true },
          },
          comments: {
            include: {
              author: {
                select: { id: true, username: true, avatar: true },
              },
              replies: {
                include: {
                  author: {
                    select: { id: true, username: true, avatar: true },
                  },
                },
              },
            },
          },
        },
        orderBy: { createdAt: "desc" },
      })
      res.status(200).json(posts)
    } catch (error) {
      console.error("Error fetching posts:", error)
      res.status(500).json({ message: "Failed to fetch posts" })
    }
  } else if (req.method === "POST") {
    const { type, content, caption } = req.body
    const userId = session.user.id

    if (!userId) {
      return res.status(400).json({ message: "User ID is missing" })
    }

    try {
      const post = await prisma.post.create({
        data: {
          type,
          content,
          caption,
          authorId: userId,
        },
      })
      res.status(201).json(post)
    } catch (error) {
      console.error("Error creating post:", error)
      res.status(500).json({ message: "Failed to create post" })
    }
  } else {
    res.setHeader("Allow", ["GET", "POST"])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}

