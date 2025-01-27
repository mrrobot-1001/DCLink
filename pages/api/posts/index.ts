import type { NextApiRequest, NextApiResponse } from "next"
import { PrismaClient } from "@prisma/client"
import { authenticate } from "../../../utils/authenticate"
import formidable from "formidable"
import fs from "fs"
import path from "path"

export const config = {
  api: {
    bodyParser: false,
  },
}

const prisma = new PrismaClient()

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const user = authenticate(req)
    if (!user) {
      return res.status(401).json({ error: "Unauthorized" })
    }

    const form = formidable()
    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error("Error parsing form data:", err)
        return res.status(500).json({ error: "Failed to parse form data" })
      }

      try {
        const { content } = fields
        const file = files.file?.[0] as formidable.File
        let fileUrl = ""

        if (file) {
          const fileName = `${Date.now()}-${file.originalFilename}`
          const newPath = path.join(process.cwd(), "public", "uploads", fileName)
          await fs.promises.copyFile(file.filepath, newPath)
          fileUrl = `/uploads/${fileName}`
        }

        const newPost = await prisma.post.create({
          data: {
            type: file ? (fields.fileType as string) : "text",
            content: content as string,
            authorId: user.id,
            ...(fileUrl && { caption: fileUrl }),
          },
        })

        res.status(201).json(newPost)
      } catch (error) {
        console.error("Error creating post:", error)
        res.status(500).json({ error: "Failed to create post" })
      }
    })
  } else if (req.method === "GET") {
    try {
      const posts = await prisma.post.findMany({
        include: {
          author: {
            select: {
              id: true,
              username: true,
            },
          },
          comments: {
            include: {
              author: {
                select: {
                  id: true,
                  username: true,
                },
              },
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      })

      res.status(200).json(posts)
    } catch (error) {
      console.error("Error fetching posts:", error)
      res.status(500).json({ error: "Failed to fetch posts" })
    }
  } else {
    res.setHeader("Allow", ["GET", "POST"])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}

