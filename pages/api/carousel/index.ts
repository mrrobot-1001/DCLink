import type { NextApiRequest, NextApiResponse } from "next"
import { PrismaClient } from "@prisma/client"

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
    try {
      const { type, src, alt } = req.body
      const newCarouselItem = await prisma.carouselItem.create({
        data: { type, src, alt },
      })
      res.status(201).json(newCarouselItem)
    } catch (error) {
      console.error("Error creating carousel item:", error)
      res.status(500).json({ error: "Failed to create carousel item" })
    }
  } else {
    res.setHeader("Allow", ["GET", "POST"])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}

