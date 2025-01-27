import type { NextApiRequest, NextApiResponse } from "next"
import { PrismaClient } from "@prisma/client"
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
  if (req.method === "GET") {
    try {
      const carouselItems = await prisma.carouselItem.findMany()
      res.status(200).json(carouselItems)
    } catch (error) {
      console.error("Error fetching carousel items:", error)
      res.status(500).json({ error: "Failed to fetch carousel items" })
    }
  } else if (req.method === "POST") {
    const form = formidable()
    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error("Error parsing form data:", err)
        return res.status(500).json({ error: "Failed to parse form data" })
      }

      try {
        const type = fields.type?.[0] as "image" | "video"
        const alt = fields.alt?.[0] as string
        let src = ""

        if (type === "image") {
          const file = files.file?.[0] as formidable.File
          if (file) {
            const fileName = `${Date.now()}-${file.originalFilename}`
            const newPath = path.join(process.cwd(), "public", "uploads", fileName)
            await fs.promises.copyFile(file.filepath, newPath)
            src = `/uploads/${fileName}`
          }
        } else if (type === "video") {
          src = fields.src?.[0] as string
        }

        const newCarouselItem = await prisma.carouselItem.create({
          data: { type, src, alt },
        })
        res.status(201).json(newCarouselItem)
      } catch (error) {
        console.error("Error creating carousel item:", error)
        res.status(500).json({ error: "Failed to create carousel item" })
      }
    })
  } else {
    res.setHeader("Allow", ["GET", "POST"])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}

