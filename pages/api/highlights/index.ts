import type { NextApiRequest, NextApiResponse } from "next"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    try {
      const highlights = await prisma.highlight.findMany()
      res.status(200).json(highlights)
    } catch (error) {
      console.error("Error fetching highlights:", error)
      res.status(500).json({ error: "Failed to fetch highlights" })
    }
  } else if (req.method === "POST") {
    try {
      const { youtubeLink, caption } = req.body
      const newHighlight = await prisma.highlight.create({
        data: { youtubeLink, caption },
      })
      res.status(201).json(newHighlight)
    } catch (error) {
      console.error("Error creating highlight:", error)
      res.status(500).json({ error: "Failed to create highlight" })
    }
  } else {
    res.setHeader("Allow", ["GET", "POST"])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}

