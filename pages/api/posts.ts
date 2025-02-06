import type { NextApiRequest, NextApiResponse } from "next"
import { PrismaClient } from "@prisma/client"
import { authenticate } from '../../utils/authenticate';
import formidable from "formidable"
import fs from "fs"
import path from "path"
import jwt from 'jsonwebtoken'

export const config = {
  api: {
    bodyParser: false,
  },
}

const prisma = new PrismaClient()

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    try {
      const user = authenticate(req)
      if (!user) {
        return res.status(401).json({ error: "Unauthorized" })
      }

      // Ensure upload directory exists
      const uploadDir = path.join(process.cwd(), "public/posts")
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true })
      }

      const form = formidable({
        uploadDir,
        keepExtensions: true,
        maxFileSize: 10 * 1024 * 1024, // 10MB
      })

      const [fields, files] = await new Promise((resolve, reject) => {
        form.parse(req, (err, fields, files) => {
          if (err) reject(err)
          resolve([fields, files])
        })
      })

      if (!fields.caption) {
        return res.status(400).json({ error: "Caption is required" })
      }

      const file = files.file?.[0] // formidable v4 returns an array
      if (!file) {
        return res.status(400).json({ error: "No file uploaded" })
      }

      const fileType = fields.fileType?.[0] || ""
      const fileName = `${Date.now()}_${file.originalFilename}`
      const filePath = `/posts/${fileName}`
      const fullPath = path.join(process.cwd(), "public", filePath)

      // Move file to final destination
      try {
        await fs.promises.rename(file.filepath, fullPath)
      } catch (error) {
        console.error("Error moving file:", error)
        return res.status(500).json({ error: "Error saving file" })
      }

      // Create post in database
      const post = await prisma.post.create({
        data: {
          userId: user.id,
          caption: fields.caption[0],
          mediaUrl: filePath,
          mediaType: fileType,
        },
        include: {
          user: {
            select: {
              username: true,
              profilePicture: true,
            },
          },
        },
      })

      return res.status(201).json({
        id: post.id,
        author: post.user.username,
        avatar: post.user.profilePicture,
        mediaUrl: post.mediaUrl,
        mediaType: post.mediaType,
        caption: post.caption,
      })
    } catch (error) {
      console.error("Error in POST /api/posts:", error)
      return res.status(500).json({ error: "Internal server error" })
    }
  } else if (req.method === "GET") {
    try {
      const posts = await prisma.post.findMany({
        include: {
          user: {
            select: {
              username: true,
              profilePicture: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      })

      const formattedPosts = posts.map((post) => ({
        id: post.id,
        author: post.user.username,
        avatar: post.user.profilePicture,
        mediaUrl: post.mediaUrl,
        mediaType: post.mediaType,
        caption: post.caption,
      }))

      return res.status(200).json(formattedPosts)
    } catch (error) {
      console.error("Error fetching posts:", error)
      return res.status(500).json({ error: "Error fetching posts" })
    }
  } else if (req.method === "DELETE") {
    try {
      // Verify JWT token
      const token = req.headers.authorization?.split(" ")[1]
      if (!token) {
        return res.status(401).json({ error: "Unauthorized" })
      }

      const decodedToken = jwt.verify(token, process.env.JWT_SECRET!) as any
      const userId = decodedToken.userId

      const postId = parseInt(req.query.id as string)
      if (!postId) {
        return res.status(400).json({ error: "Post ID is required" })
      }

      // Check if the post exists and belongs to the user
      const post = await prisma.post.findUnique({
        where: { id: postId },
        select: { authorId: true, mediaUrl: true }
      })

      if (!post) {
        return res.status(404).json({ error: "Post not found" })
      }

      if (post.authorId !== userId) {
        return res.status(403).json({ error: "You can only delete your own posts" })
      }

      // Delete the post and its associated file
      await prisma.post.delete({
        where: { id: postId }
      })

      // Delete the file from the uploads directory if it exists
      if (post.mediaUrl) {
        const filePath = path.join(process.cwd(), post.mediaUrl)
        try {
          await fs.unlink(filePath)
        } catch (error) {
          console.error("Error deleting file:", error)
          // Continue even if file deletion fails
        }
      }

      return res.status(200).json({ message: "Post deleted successfully" })
    } catch (error) {
      console.error("Error deleting post:", error)
      return res.status(500).json({ error: "Failed to delete post" })
    }
  } else {
    res.setHeader("Allow", ["POST", "GET", "DELETE"])
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` })
  }
}
