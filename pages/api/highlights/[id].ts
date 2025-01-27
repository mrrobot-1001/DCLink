import type { NextApiRequest, NextApiResponse } from "next"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query

  if (req.method === "PUT") {
    try {
      const { youtubeLink, caption } = req.body
      const updatedHighlight = await prisma.highlight.update({
        where: { id: Number(id) },
        data: { youtubeLink, caption },
      })
      res.status(200).json(updatedHighlight)
    } catch (error) {
      console.error("Error updating highlight:", error)
      res.status(500).json({ error: "Failed to update highlight" })
    }
  } else if (req.method === "DELETE") {
    try {
      await prisma.highlight.delete({
        where: { id: Number(id) },
      })
      res.status(200).json({ message: "Highlight deleted successfully" })
    } catch (error) {
      console.error("Error deleting highlight:", error)
      res.status(500).json({ error: "Failed to delete highlight" })
    }
  } else {
    res.setHeader("Allow", ["PUT", "DELETE"])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}

