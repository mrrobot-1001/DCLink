import type { NextApiRequest, NextApiResponse } from "next"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query

  if (req.method === "PUT") {
    try {
      const { type, src, alt } = req.body
      const updatedCarouselItem = await prisma.carouselItem.update({
        where: { id: Number(id) },
        data: { type, src, alt },
      })
      res.status(200).json(updatedCarouselItem)
    } catch (error) {
      console.error("Error updating carousel item:", error)
      res.status(500).json({ error: "Failed to update carousel item" })
    }
  } else if (req.method === "DELETE") {
    try {
      await prisma.carouselItem.delete({
        where: { id: Number(id) },
      })
      res.status(200).json({ message: "Carousel item deleted successfully" })
    } catch (error) {
      console.error("Error deleting carousel item:", error)
      res.status(500).json({ error: "Failed to delete carousel item" })
    }
  } else {
    res.setHeader("Allow", ["PUT", "DELETE"])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}

