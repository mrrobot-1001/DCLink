import type { NextApiRequest, NextApiResponse } from "next"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query

  if (req.method === "DELETE") {
    try {
      const deletedUser = await prisma.user.delete({
        where: { id: Number(id) },
      })
      res.status(200).json({ message: "User deleted successfully", user: deletedUser })
    } catch (error) {
      console.error("Error deleting user:", error)
      res.status(500).json({ error: "Failed to delete user" })
    }
  } else {
    res.setHeader("Allow", ["DELETE"])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}

