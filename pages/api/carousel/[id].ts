import type { NextApiRequest, NextApiResponse } from "next"
import { PrismaClient } from "@prisma/client"
import { authenticate } from "../../../utils/authenticate"
import fs from "fs"
import path from "path"

const prisma = new PrismaClient()

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Authenticate the user
  const user = authenticate(req)
  if (!user) {
    return res.status(401).json({ error: "Unauthorized" })
  }

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
      // Get the carousel item first
      const carouselItem = await prisma.carouselItem.findUnique({
        where: { id: Number(id) },
      })

      if (!carouselItem) {
        return res.status(404).json({ error: "Carousel item not found" })
      }

      // Delete the file if it exists in our uploads directory
      if (carouselItem.src.startsWith("/uploads/")) {
        const filePath = path.join(process.cwd(), "public", carouselItem.src)
        try {
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath)
          }
        } catch (error) {
          console.error("Error deleting file:", error)
          // Continue with deletion even if file removal fails
        }
      }

      // Delete from database
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
